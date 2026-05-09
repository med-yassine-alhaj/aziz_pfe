<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceRequestResource;
use App\Http\Resources\InvoiceResource;
use App\Models\AppNotification;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        $requests = $user->serviceRequests();
        $invoices = $user->invoices();

        return response()->json([
            'stats' => [
                'pending_requests'     => (clone $requests)->where('status', 'pending')->count(),
                'active_discussions'   => (clone $requests)->where('status', 'discussion')->count(),
                'quotes_sent'          => (clone $requests)->where('status', 'quote_sent')->count(),
                'unpaid_invoices'      => (clone $invoices)->where('status', 'unpaid')->count(),
                'total_requests'       => (clone $requests)->count(),
            ],
            'recent_requests' => ServiceRequestResource::collection(
                $user->serviceRequests()
                    ->with(['service', 'pack'])
                    ->latest()
                    ->take(5)
                    ->get()
            ),
            'recent_invoices' => InvoiceResource::collection(
                $user->invoices()->latest()->take(3)->get()
            ),
            'unread_notifications' => AppNotification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }
}
