<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuoteResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Quote;
use App\Models\User;
use App\Services\PdfService;

class QuoteController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index()
    {
        $quotes = auth()->user()->quotes()
            ->with(['serviceRequest.service', 'items'])
            ->latest()
            ->paginate(10);

        return QuoteResource::collection($quotes);
    }

    public function show(Quote $quote)
    {
        $this->authorize('view', $quote);

        return new QuoteResource($quote->load(['client', 'serviceRequest.service', 'items', 'createdBy']));
    }

    public function accept(Quote $quote)
    {
        $this->authorize('respond', $quote);

        $quote->update(['status' => 'accepted']);
        $quote->serviceRequest->update(['status' => 'quote_accepted']);

        // Notify admins
        $quote->createdBy->notifications()->create([
            'title'   => 'Devis accepté',
            'message' => auth()->user()->name . ' a accepté le devis ' . $quote->quote_number,
            'type'    => 'quote_accepted',
            'link'    => '/admin/quotes/' . $quote->id,
        ]);

        ActivityLog::record('accepted', 'Quote', $quote->id, 'Devis accepté : ' . $quote->quote_number);

        // Auto-convert to invoice
        $invoice = Invoice::create([
            'client_id'          => $quote->client_id,
            'service_request_id' => $quote->service_request_id,
            'quote_id'           => $quote->id,
            'subtotal'           => $quote->subtotal,
            'discount_amount'    => $quote->discount_amount,
            'tax_amount'         => $quote->tax_amount,
            'total'              => $quote->total,
            'status'             => 'waiting_accountant_validation',
            'notes'              => $quote->notes,
            'created_by'         => auth()->id(),
        ]);

        foreach ($quote->items as $item) {
            InvoiceItem::create([
                'invoice_id'      => $invoice->id,
                'title'           => $item->title,
                'description'     => $item->description,
                'quantity'        => $item->quantity,
                'unit_price'      => $item->unit_price,
                'tax_rate'        => $item->tax_rate,
                'discount_amount' => $item->discount_amount,
                'order'           => $item->order,
            ]);
        }

        $quote->serviceRequest->update(['status' => 'invoice_generated']);

        // Notify client about invoice
        AppNotification::create([
            'user_id' => $quote->client_id,
            'title'   => 'Facture générée',
            'message' => 'Votre devis a été accepté. Une facture a été créée : ' . $invoice->invoice_number,
            'type'    => 'invoice_generated',
            'link'    => '/client/invoices/' . $invoice->id,
        ]);

        // Notify accountants
        User::accountants()->each(function ($accountant) use ($invoice) {
            AppNotification::create([
                'user_id' => $accountant->id,
                'title'   => 'Facture à valider',
                'message' => 'La facture ' . $invoice->invoice_number . ' attend votre validation.',
                'type'    => 'invoice_to_validate',
                'link'    => '/accountant/invoices/' . $invoice->id,
            ]);
        });

        ActivityLog::record('created', 'Invoice', $invoice->id, 'Facture créée automatiquement depuis devis accepté : ' . $quote->quote_number);

        return response()->json([
            'message' => 'Devis accepté et facture générée avec succès.',
            'invoice_id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
        ]);
    }

    public function refuse(Quote $quote)
    {
        $this->authorize('respond', $quote);

        $quote->update(['status' => 'refused']);
        $quote->serviceRequest->update(['status' => 'quote_refused']);

        ActivityLog::record('refused', 'Quote', $quote->id, 'Devis refusé : ' . $quote->quote_number);

        return response()->json(['message' => 'Devis refusé.', 'quote' => new QuoteResource($quote)]);
    }

    public function download(Quote $quote)
    {
        $this->authorize('view', $quote);

        $pdf = $this->pdfService->generateQuotePdf($quote->load(['client', 'items', 'serviceRequest.service', 'createdBy']));

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $quote->quote_number . '.pdf"',
        ]);
    }
}
