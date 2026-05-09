<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\QuoteRequest;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\QuoteResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Services\PdfService;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index(Request $request)
    {
        $query = Quote::with(['client', 'serviceRequest.service'])
            ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return QuoteResource::collection($query->paginate(15));
    }

    public function show(Quote $quote)
    {
        return new QuoteResource($quote->load(['client', 'serviceRequest.service', 'items', 'createdBy']));
    }

    public function store(QuoteRequest $request)
    {
        $quote = Quote::create([
            'client_id'          => $request->client_id,
            'service_request_id' => $request->service_request_id,
            'discount_amount'    => $request->discount_amount ?? 0,
            'notes'              => $request->notes,
            'valid_until'        => $request->valid_until,
            'status'             => 'draft',
            'created_by'         => auth()->id(),
        ]);

        foreach ($request->items as $order => $itemData) {
            QuoteItem::create([
                'quote_id'        => $quote->id,
                'title'           => $itemData['title'],
                'description'     => $itemData['description'] ?? null,
                'quantity'        => $itemData['quantity'],
                'unit_price'      => $itemData['unit_price'],
                'tax_rate'        => $itemData['tax_rate'],
                'discount_amount' => $itemData['discount_amount'] ?? 0,
                'order'           => $order,
            ]);
        }

        $quote->load('items');
        $quote->recalculate();

        return new QuoteResource($quote->fresh()->load(['client', 'serviceRequest.service', 'items', 'createdBy']));
    }

    public function update(QuoteRequest $request, Quote $quote)
    {
        if (!in_array($quote->status, ['draft', 'sent'])) {
            return response()->json(['message' => 'Ce devis ne peut plus être modifié.'], 422);
        }

        $quote->update([
            'discount_amount' => $request->discount_amount ?? 0,
            'notes'           => $request->notes,
            'valid_until'     => $request->valid_until,
        ]);

        $quote->items()->delete();

        foreach ($request->items as $order => $itemData) {
            QuoteItem::create([
                'quote_id'        => $quote->id,
                'title'           => $itemData['title'],
                'description'     => $itemData['description'] ?? null,
                'quantity'        => $itemData['quantity'],
                'unit_price'      => $itemData['unit_price'],
                'tax_rate'        => $itemData['tax_rate'],
                'discount_amount' => $itemData['discount_amount'] ?? 0,
                'order'           => $order,
            ]);
        }

        $quote->load('items');
        $quote->recalculate();

        return new QuoteResource($quote->fresh()->load(['client', 'serviceRequest.service', 'items', 'createdBy']));
    }

    public function send(Quote $quote)
    {
        if ($quote->status !== 'draft') {
            return response()->json(['message' => 'Ce devis a déjà été envoyé.'], 422);
        }

        $quote->update(['status' => 'sent']);
        $quote->serviceRequest->update(['status' => 'quote_sent']);

        AppNotification::create([
            'user_id' => $quote->client_id,
            'title'   => 'Devis reçu',
            'message' => 'Vous avez reçu un devis : ' . $quote->quote_number . '. Consultez-le dans votre espace.',
            'type'    => 'quote_sent',
            'link'    => '/client/quotes/' . $quote->id,
        ]);

        ActivityLog::record('sent', 'Quote', $quote->id, 'Devis envoyé au client : ' . $quote->quote_number);

        return new QuoteResource($quote);
    }

    public function convertToInvoice(Quote $quote)
    {
        if ($quote->status !== 'accepted') {
            return response()->json(['message' => 'Le devis doit être accepté pour générer une facture.'], 422);
        }

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

        AppNotification::create([
            'user_id' => $quote->client_id,
            'title'   => 'Facture générée',
            'message' => 'Une facture a été générée : ' . $invoice->invoice_number,
            'type'    => 'invoice_generated',
            'link'    => '/client/invoices/' . $invoice->id,
        ]);

        ActivityLog::record('created', 'Invoice', $invoice->id, 'Facture créée depuis devis : ' . $quote->quote_number);

        return new InvoiceResource($invoice->load(['client', 'items']));
    }

    public function download(Quote $quote)
    {
        $pdf = $this->pdfService->generateQuotePdf($quote->load(['client', 'items', 'serviceRequest.service', 'createdBy']));

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $quote->quote_number . '.pdf"',
        ]);
    }
}
