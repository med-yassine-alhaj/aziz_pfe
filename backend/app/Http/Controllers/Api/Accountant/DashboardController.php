<?php

namespace App\Http\Controllers\Api\Accountant;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\PaymentResource;
use App\Models\Invoice;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $currentMonth = now()->startOfMonth();

        $totalRevenue = Invoice::where('status', 'paid')->sum('total');
        $monthlyRevenue = Invoice::where('status', 'paid')->where('paid_at', '>=', $currentMonth)->sum('total');

        $pendingPaymentsCount = Payment::where('status', 'pending')->count();
        $pendingValidationCount = Invoice::where('status', 'waiting_accountant_validation')->count();

        $latestPending = Invoice::with(['service_request.client'])
            ->where('status', 'waiting_accountant_validation')
            ->latest()
            ->take(5)
            ->get();

        $latestPayments = Payment::with(['client', 'invoice.service_request'])
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_revenue'       => $totalRevenue,
            'revenue_this_month'  => $monthlyRevenue,
            'pending_validation'  => $pendingValidationCount,
            'pending_payments'    => $pendingPaymentsCount,
            'latest_pending'      => InvoiceResource::collection($latestPending),
            'latest_payments'     => PaymentResource::collection($latestPayments),
        ]);
    }
}
