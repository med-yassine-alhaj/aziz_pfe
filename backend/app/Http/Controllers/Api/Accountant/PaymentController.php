<?php

namespace App\Http\Controllers\Api\Accountant;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Payment;
use App\Models\Receipt;
use App\Services\PdfService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PdfService $pdfService) {}

    public function index(Request $request)
    {
        $query = Payment::with(['client', 'invoice'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return PaymentResource::collection($query->paginate(15));
    }

    public function show(Payment $payment)
    {
        return new PaymentResource($payment->load(['client', 'invoice.items', 'validatedByAccountant', 'receipt']));
    }

    public function accept(Request $request, Payment $payment)
    {
        $request->validate([
            'comment' => ['nullable', 'string'],
        ]);

        if ($payment->status !== 'pending') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 422);
        }

        $payment->update([
            'status'                     => 'success',
            'accountant_comment'         => $request->comment,
            'validated_by_accountant_id' => auth()->id(),
            'paid_at'                    => now(),
        ]);

        $payment->invoice->update([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);

        // Generate receipt
        $receipt = Receipt::create([
            'payment_id' => $payment->id,
            'invoice_id' => $payment->invoice_id,
            'client_id'  => $payment->client_id,
            'amount'     => $payment->amount,
        ]);

        $pdf = $this->pdfService->generateReceiptPdf($receipt->load(['client', 'invoice', 'payment']));
        $pdfPath = 'receipts/' . $receipt->receipt_number . '.pdf';
        \Storage::disk('public')->put($pdfPath, $pdf);
        $receipt->update(['pdf_path' => $pdfPath]);

        // Notify client
        AppNotification::create([
            'user_id' => $payment->client_id,
            'title'   => 'Paiement validé',
            'message' => 'Votre paiement de ' . number_format($payment->amount, 2) . ' MAD a été validé. Reçu disponible.',
            'type'    => 'payment_validated',
            'link'    => '/client/receipts/' . $receipt->id,
        ]);

        ActivityLog::record('validated', 'Payment', $payment->id,
            'Paiement validé par ' . auth()->user()->name);

        return new PaymentResource($payment->fresh()->load(['client', 'invoice', 'receipt']));
    }

    public function reject(Request $request, Payment $payment)
    {
        $request->validate([
            'comment' => ['required', 'string'],
        ]);

        if ($payment->status !== 'pending') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 422);
        }

        $payment->update([
            'status'             => 'rejected',
            'accountant_comment' => $request->comment,
        ]);

        $payment->invoice->update(['status' => 'unpaid']);

        AppNotification::create([
            'user_id' => $payment->client_id,
            'title'   => 'Paiement rejeté',
            'message' => 'Votre paiement a été rejeté. Motif : ' . $request->comment,
            'type'    => 'payment_rejected',
            'link'    => '/client/invoices/' . $payment->invoice_id,
        ]);

        ActivityLog::record('rejected', 'Payment', $payment->id, 'Paiement rejeté');

        return new PaymentResource($payment->fresh());
    }

    public function generateReceipt(Payment $payment)
    {
        if ($payment->status !== 'success') {
            return response()->json(['message' => 'Le paiement doit être validé pour générer un reçu.'], 422);
        }

        $receipt = $payment->receipt ?? Receipt::create([
            'payment_id' => $payment->id,
            'invoice_id' => $payment->invoice_id,
            'client_id'  => $payment->client_id,
            'amount'     => $payment->amount,
        ]);

        $pdf = $this->pdfService->generateReceiptPdf($receipt->load(['client', 'invoice', 'payment']));
        $pdfPath = 'receipts/' . $receipt->receipt_number . '.pdf';
        \Storage::disk('public')->put($pdfPath, $pdf);
        $receipt->update(['pdf_path' => $pdfPath]);

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $receipt->receipt_number . '.pdf"',
        ]);
    }
}
