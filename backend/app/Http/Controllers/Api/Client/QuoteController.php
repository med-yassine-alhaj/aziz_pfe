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
use App\Models\Project;
use App\Services\PdfService;
use Illuminate\Support\Facades\DB;

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

        $invoice = DB::transaction(function () use ($quote) {
            $lockedQuote = Quote::whereKey($quote->id)->lockForUpdate()->firstOrFail();
            if ($lockedQuote->status !== 'sent') {
                abort(422, 'Seul un devis envoyé peut être accepté.');
            }
            if (Invoice::where('quote_id', $lockedQuote->id)->exists()) {
                abort(422, 'Une facture existe déjà pour ce devis.');
            }
            $lockedQuote->update(['status' => 'accepted']);
            $lockedQuote->serviceRequest->update(['status' => 'quote_accepted']);
            $createdInvoice = Invoice::create([
                'client_id' => $lockedQuote->client_id,
                'service_request_id' => $lockedQuote->service_request_id,
                'quote_id' => $lockedQuote->id,
                'subtotal' => $lockedQuote->subtotal,
                'discount_amount' => $lockedQuote->discount_amount,
                'tax_amount' => $lockedQuote->tax_amount,
                'total' => $lockedQuote->total,
                'status' => 'waiting_accountant_validation',
                'notes' => $lockedQuote->notes,
                'created_by' => auth()->id(),
            ]);
            foreach ($lockedQuote->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $createdInvoice->id, 'title' => $item->title,
                    'description' => $item->description, 'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price, 'tax_rate' => $item->tax_rate,
                    'discount_amount' => $item->discount_amount, 'order' => $item->order,
                ]);
            }
            $lockedQuote->serviceRequest->update(['status' => 'invoice_generated']);
            Project::firstOrCreate(
                ['service_request_id' => $lockedQuote->service_request_id],
                [
                    'client_id' => $lockedQuote->client_id,
                    'name' => $lockedQuote->serviceRequest->title,
                    'reference' => 'ENG-' . date('Y') . '-' . str_pad((string) $lockedQuote->service_request_id, 5, '0', STR_PAD_LEFT),
                ]
            );
            return $createdInvoice;
        });

        // Notify admins
        $quote->createdBy->notifications()->create([
            'title'   => 'Devis accepté',
            'message' => auth()->user()->name . ' a accepté le devis ' . $quote->quote_number,
            'type'    => 'quote_accepted',
            'link'    => '/admin/quotes/' . $quote->id,
        ]);

        ActivityLog::record('accepted', 'Quote', $quote->id, 'Devis accepté : ' . $quote->quote_number);

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
