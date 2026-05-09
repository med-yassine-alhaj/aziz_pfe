<?php

namespace App\Http\Controllers\Api\Accountant;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Invoice;
use App\Services\PdfService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index(Request $request)
    {
        $query = Invoice::with(['client', 'serviceRequest.service'])->latest();

        if ($request->status)    { $query->where('status', $request->status); }
        if ($request->client_id) { $query->where('client_id', $request->client_id); }
        if ($request->date_from) { $query->whereDate('created_at', '>=', $request->date_from); }
        if ($request->date_to)   { $query->whereDate('created_at', '<=', $request->date_to); }

        return InvoiceResource::collection($query->paginate(15));
    }

    public function show(Invoice $invoice)
    {
        return new InvoiceResource(
            $invoice->load(['client', 'serviceRequest.service', 'items', 'payments.validatedByAccountant', 'receipt'])
        );
    }

    public function validateInvoice(Invoice $invoice)
    {
        if ($invoice->status !== 'waiting_accountant_validation') {
            return response()->json(['message' => 'Cette facture ne peut pas être validée.'], 422);
        }

        $invoice->update([
            'status'                     => 'unpaid',
            'validated_by_accountant_id' => auth()->id(),
            'validated_at'               => now(),
        ]);

        AppNotification::create([
            'user_id' => $invoice->client_id,
            'title'   => 'Facture disponible',
            'message' => 'Votre facture ' . $invoice->invoice_number . ' est prête. Vous pouvez la régler.',
            'type'    => 'invoice_validated',
            'link'    => '/client/invoices/' . $invoice->id,
        ]);

        ActivityLog::record('validated', 'Invoice', $invoice->id,
            'Facture validée par le comptable ' . auth()->user()->name);

        return new InvoiceResource($invoice->fresh());
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
        ]);

        ActivityLog::record('cancelled', 'Invoice', $invoice->id, 'Facture annulée par le comptable');

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

    public function export()
    {
        $invoices = Invoice::with(['client', 'serviceRequest.service'])->get();

        $csv = "Numéro,Client,Service,Montant HT,TVA,Total TTC,Statut,Date\n";
        foreach ($invoices as $inv) {
            $csv .= implode(',', [
                $inv->invoice_number,
                '"' . ($inv->client->name ?? '') . '"',
                '"' . ($inv->serviceRequest->service->name ?? '') . '"',
                number_format($inv->subtotal, 2),
                number_format($inv->tax_amount, 2),
                number_format($inv->total, 2),
                $inv->status_label,
                $inv->created_at->format('d/m/Y'),
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="factures_' . now()->format('Y-m-d') . '.csv"',
        ]);
    }
}
