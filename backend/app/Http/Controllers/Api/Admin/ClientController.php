<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\QuoteResource;
use App\Http\Resources\ServiceRequestResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::clients()->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return UserResource::collection($query->paginate(15));
    }

    public function show(User $user)
    {
        return response()->json([
            'client'   => new UserResource($user),
            'requests' => ServiceRequestResource::collection(
                $user->serviceRequests()->with(['service', 'pack'])->latest()->take(5)->get()
            ),
            'quotes'   => QuoteResource::collection(
                $user->quotes()->latest()->take(5)->get()
            ),
            'invoices' => InvoiceResource::collection(
                $user->invoices()->latest()->take(5)->get()
            ),
            'stats' => [
                'total_requests'  => $user->serviceRequests()->count(),
                'total_invoices'  => $user->invoices()->count(),
                'total_paid'      => $user->invoices()->where('status', 'paid')->sum('total'),
                'unpaid_invoices' => $user->invoices()->where('status', 'unpaid')->count(),
            ],
        ]);
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return new UserResource($user);
    }
}
