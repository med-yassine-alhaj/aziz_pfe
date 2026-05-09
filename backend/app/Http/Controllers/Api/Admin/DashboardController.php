<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceRequestResource;
use App\Models\Invoice;
use App\Models\ServiceRequest;
use App\Models\User;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'stats' => [
                'pending_requests'    => ServiceRequest::where('status', 'pending')->count(),
                'in_discussion'       => ServiceRequest::where('status', 'discussion')->count(),
                'quotes_to_prepare'   => ServiceRequest::where('status', 'quote_accepted')->count(),
                'in_progress'         => ServiceRequest::where('status', 'in_progress')->count(),
                'completed'           => ServiceRequest::where('status', 'completed')->count(),
                'total_clients'       => User::clients()->count(),
                'unpaid_invoices'     => Invoice::whereIn('status', ['unpaid', 'payment_pending'])->count(),
            ],
            'recent_requests' => ServiceRequestResource::collection(
                ServiceRequest::with(['client', 'service', 'pack'])
                    ->latest()
                    ->take(8)
                    ->get()
            ),
        ]);
    }
}
