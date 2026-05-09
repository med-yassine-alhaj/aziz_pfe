<?php

namespace App\Http\Controllers\Api\Accountant;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $currentMonth = now()->startOfMonth();

        return response()->json([
            'stats' => [
                'total_revenue'          => Invoice::where('status', 'paid')->sum('total'),
                'monthly_revenue'        => Invoice::where('status', 'paid')->where('paid_at', '>=', $currentMonth)->sum('total'),
                'unpaid_invoices'        => Invoice::where('status', 'unpaid')->count(),
                'unpaid_amount'          => Invoice::where('status', 'unpaid')->sum('total'),
                'payments_to_validate'   => Payment::where('status', 'pending')->count(),
                'total_tax_collected'    => Invoice::where('status', 'paid')->sum('tax_amount'),
                'invoices_to_validate'   => Invoice::where('status', 'waiting_accountant_validation')->count(),
                'paid_invoices'          => Invoice::where('status', 'paid')->count(),
            ],
            'recent_payments' => Payment::with(['client', 'invoice'])
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
