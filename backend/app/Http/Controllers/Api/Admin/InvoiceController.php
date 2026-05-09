<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Invoice;
use App\Models\User;
use App\Services\PdfService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index(Request $request)
    {
        $query = Invoice::with(['client', 'serviceRequest.service'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        return InvoiceResource::collection($query->paginate(15));
    }

    public function show(Invoice $invoice)
    {
        return new InvoiceResource(
            $invoice->load(['client', 'serviceRequest.service', 'items', 'payments', 'quote', 'validatedByAccountant'])
        );
    }

    public function sendToAccountant(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return response()->json(['message' => 'Statut invalide pour cette action.'], 422);
        }

        $invoice->update(['status' => 'waiting_accountant_validation']);

        User::accountants()->each(function ($accountant) use ($invoice) {
            AppNotification::create([
                'user_id' => $accountant->id,
                'title'   => 'Facture à valider',
                'message' => 'La facture ' . $invoice->invoice_number . ' attend votre validation.',
                'type'    => 'invoice_to_validate',
                'link'    => '/accountant/invoices/' . $invoice->id,
            ]);
        });

        ActivityLog::record('sent_to_accountant', 'Invoice', $invoice->id, 'Facture envoyée au comptable');

        return new InvoiceResource($invoice);
    }

    public function cancel(Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return response()->json(['message' => 'Une facture payée ne peut pas être annulée.'], 422);
        }

        $invoice->update(['status' => 'cancelled']);

        AppNotification::create([
            'user_id' => $invoice->client_id,
            'title'   => 'Facture annulée',
            'message' => 'La facture ' . $invoice->invoice_number . ' a été annulée.',
            'type'    => 'invoice_cancelled',
            'link'    => '/client/invoices/' . $invoice->id,
        ]);

        ActivityLog::record('cancelled', 'Invoice', $invoice->id, 'Facture annulée');

        return new InvoiceResource($invoice);
    }

    public function download(Invoice $invoice)
    {
        $pdf = $this->pdfService->generateInvoicePdf(
            $invoice->load(['client', 'items', 'serviceRequest.service'])
        );

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $invoice->invoice_number . '.pdf"',
        ]);
    }
}
