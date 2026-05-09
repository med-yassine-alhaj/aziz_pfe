<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuoteResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Quote;
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

        return response()->json(['message' => 'Devis accepté avec succès.', 'quote' => new QuoteResource($quote)]);
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
