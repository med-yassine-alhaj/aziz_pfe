<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\PaymentRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Services\PdfService;

class InvoiceController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index()
    {
        $invoices = auth()->user()->invoices()
            ->with(['serviceRequest.service'])
            ->latest()
            ->paginate(10);

        return InvoiceResource::collection($invoices);
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return new InvoiceResource(
            $invoice->load(['client', 'serviceRequest.service', 'items', 'payments', 'receipt'])
        );
    }

    public function pay(PaymentRequest $request, Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        if (!in_array($invoice->status, ['unpaid'])) {
            return response()->json(['message' => 'Cette facture ne peut pas être payée.'], 422);
        }

        $proofPath = null;
        if ($request->hasFile('payment_proof')) {
            $proofPath = $request->file('payment_proof')->store('payments/' . $invoice->id, 'public');
        }

        $payment = Payment::create([
            'invoice_id'            => $invoice->id,
            'client_id'             => auth()->id(),
            'amount'                => $invoice->total,
            'method'                => $request->method,
            'status'                => 'pending',
            'payment_proof'         => $proofPath,
            'transaction_reference' => $request->transaction_reference,
        ]);

        $invoice->update(['status' => 'payment_pending']);

        // Notify accountants
        User::accountants()->each(function ($accountant) use ($invoice, $payment) {
            AppNotification::create([
                'user_id' => $accountant->id,
                'title'   => 'Paiement reçu',
                'message' => 'Paiement en attente de validation pour la facture ' . $invoice->invoice_number,
                'type'    => 'payment_pending',
                'link'    => '/accountant/payments/' . $payment->id,
            ]);
        });

        ActivityLog::record('payment_submitted', 'Invoice', $invoice->id, 'Paiement soumis pour la facture ' . $invoice->invoice_number);

        return response()->json(['message' => 'Paiement soumis. En attente de validation.']);
    }

    public function download(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $pdf = $this->pdfService->generateInvoicePdf(
            $invoice->load(['client', 'items', 'serviceRequest.service'])
        );

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $invoice->invoice_number . '.pdf"',
        ]);
    }
}
