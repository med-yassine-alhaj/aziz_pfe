<?php

namespace App\Http\Controllers\Api\Accountant;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function revenue(Request $request)
    {
        $year = $request->year ?? now()->year;

        $monthly = Invoice::where('status', 'paid')
            ->whereYear('paid_at', $year)
            ->selectRaw('MONTH(paid_at) as month, SUM(total) as revenue, SUM(tax_amount) as tax, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $data = [];
        for ($m = 1; $m <= 12; $m++) {
            $data[] = [
                'month'   => $m,
                'label'   => now()->month($m)->translatedFormat('F'),
                'revenue' => $monthly[$m]->revenue ?? 0,
                'tax'     => $monthly[$m]->tax ?? 0,
                'count'   => $monthly[$m]->count ?? 0,
            ];
        }

        return response()->json([
            'year'          => $year,
            'monthly_data'  => $data,
            'total_revenue' => Invoice::where('status', 'paid')->whereYear('paid_at', $year)->sum('total'),
            'total_tax'     => Invoice::where('status', 'paid')->whereYear('paid_at', $year)->sum('tax_amount'),
        ]);
    }

    public function taxes(Request $request)
    {
        $year = $request->year ?? now()->year;

        return response()->json([
            'year'      => $year,
            'total_tax' => Invoice::where('status', 'paid')->whereYear('paid_at', $year)->sum('tax_amount'),
            'by_month'  => Invoice::where('status', 'paid')
                ->whereYear('paid_at', $year)
                ->selectRaw('MONTH(paid_at) as month, SUM(tax_amount) as tax')
                ->groupBy('month')
                ->get(),
        ]);
    }

    public function unpaidInvoices()
    {
        $invoices = Invoice::with(['client', 'serviceRequest.service'])
            ->whereIn('status', ['unpaid', 'payment_pending'])
            ->latest()
            ->get();

        return response()->json([
            'invoices'      => $invoices,
            'total_unpaid'  => $invoices->sum('total'),
            'count'         => $invoices->count(),
        ]);
    }

    public function serviceRevenue()
    {
        $data = Invoice::where('status', 'paid')
            ->join('service_requests', 'invoices.service_request_id', '=', 'service_requests.id')
            ->join('services', 'service_requests.service_id', '=', 'services.id')
            ->selectRaw('services.name as service_name, COUNT(*) as count, SUM(invoices.total) as revenue')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('revenue')
            ->get();

        return response()->json(['service_revenue' => $data]);
    }

    public function clientRevenue()
    {
        $data = User::clients()
            ->withSum(['invoices as total_revenue' => fn($q) => $q->where('status', 'paid')], 'total')
            ->withCount('invoices')
            ->orderByDesc('total_revenue')
            ->take(20)
            ->get();

        return response()->json(['client_revenue' => $data]);
    }
}
