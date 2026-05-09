<?php

use App\Http\Controllers\Api\Auth\GoogleController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\PublicPackController;
use App\Http\Controllers\Api\PublicServiceController;
use App\Http\Controllers\Api\Client;
use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\Accountant;
use Illuminate\Support\Facades\Route;

// ─── AUTH PUBLIC ─────────────────────────────────────────────────────────────
Route::post('/register', RegisterController::class);
Route::post('/login', [LoginController::class, 'login']);
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

// ─── PUBLIC ──────────────────────────────────────────────────────────────────
Route::get('/services', [PublicServiceController::class, 'index']);
Route::get('/services/{service}', [PublicServiceController::class, 'show']);
Route::get('/packs', [PublicPackController::class, 'index']);
Route::get('/packs/{pack}', [PublicPackController::class, 'show']);

// ─── AUTHENTICATED ───────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'ensure.active'])->group(function () {

    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [LoginController::class, 'me']);

    // Notifications
    Route::get('/notifications', fn() => auth()->user()->notifications()->latest()->get());
    Route::post('/notifications/{notification}/read', function ($id) {
        $n = auth()->user()->notifications()->findOrFail($id);
        $n->update(['is_read' => true]);
        return response()->json(['message' => 'Lu']);
    });
    Route::post('/notifications/read-all', function () {
        auth()->user()->notifications()->update(['is_read' => true]);
        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    });

    // ─── CLIENT ──────────────────────────────────────────────────────────────
    Route::middleware('role.client')->prefix('client')->group(function () {
        Route::get('/dashboard', Client\DashboardController::class);

        Route::get('/requests', [Client\ServiceRequestController::class, 'index']);
        Route::post('/requests', [Client\ServiceRequestController::class, 'store']);
        Route::get('/requests/{serviceRequest}', [Client\ServiceRequestController::class, 'show']);

        Route::get('/requests/{serviceRequest}/chat', [Client\ChatController::class, 'show']);
        Route::post('/requests/{serviceRequest}/chat', [Client\ChatController::class, 'sendMessage']);

        Route::get('/quotes', [Client\QuoteController::class, 'index']);
        Route::get('/quotes/{quote}', [Client\QuoteController::class, 'show']);
        Route::post('/quotes/{quote}/accept', [Client\QuoteController::class, 'accept']);
        Route::post('/quotes/{quote}/refuse', [Client\QuoteController::class, 'refuse']);
        Route::get('/quotes/{quote}/download', [Client\QuoteController::class, 'download']);

        Route::get('/invoices', [Client\InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [Client\InvoiceController::class, 'show']);
        Route::post('/invoices/{invoice}/pay', [Client\InvoiceController::class, 'pay']);
        Route::get('/invoices/{invoice}/download', [Client\InvoiceController::class, 'download']);

        Route::get('/profile', fn() => new \App\Http\Resources\UserResource(auth()->user()));
        Route::put('/profile', function (\Illuminate\Http\Request $r) {
            $data = $r->validate([
                'name'     => ['sometimes', 'string', 'min:2'],
                'phone'    => ['nullable', 'string'],
                'password' => ['nullable', 'string', 'min:8', 'confirmed'],
                'avatar'   => ['nullable', 'image', 'max:2048'],
            ]);
            if ($r->hasFile('avatar')) {
                $data['avatar'] = $r->file('avatar')->store('avatars', 'public');
            }
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }
            auth()->user()->update($data);
            return new \App\Http\Resources\UserResource(auth()->user()->fresh());
        });
    });

    // ─── ADMIN ───────────────────────────────────────────────────────────────
    Route::middleware('role.admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', Admin\DashboardController::class);

        Route::get('/services', [Admin\ServiceController::class, 'index']);
        Route::post('/services', [Admin\ServiceController::class, 'store']);
        Route::put('/services/{service}', [Admin\ServiceController::class, 'update']);
        Route::delete('/services/{service}', [Admin\ServiceController::class, 'destroy']);
        Route::patch('/services/{service}/toggle', [Admin\ServiceController::class, 'toggle']);

        Route::get('/packs', [Admin\PackController::class, 'index']);
        Route::post('/packs', [Admin\PackController::class, 'store']);
        Route::put('/packs/{pack}', [Admin\PackController::class, 'update']);
        Route::delete('/packs/{pack}', [Admin\PackController::class, 'destroy']);

        Route::get('/requests', [Admin\RequestController::class, 'index']);
        Route::get('/requests/{serviceRequest}', [Admin\RequestController::class, 'show']);
        Route::put('/requests/{serviceRequest}/status', [Admin\RequestController::class, 'updateStatus']);
        Route::put('/requests/{serviceRequest}/assign', [Admin\RequestController::class, 'assign']);
        Route::post('/requests/{serviceRequest}/open-conversation', [Admin\RequestController::class, 'openConversation']);

        Route::get('/requests/{serviceRequest}/chat', [Admin\ChatController::class, 'show']);
        Route::post('/requests/{serviceRequest}/chat', [Admin\ChatController::class, 'sendMessage']);

        Route::get('/quotes', [Admin\QuoteController::class, 'index']);
        Route::post('/quotes', [Admin\QuoteController::class, 'store']);
        Route::get('/quotes/{quote}', [Admin\QuoteController::class, 'show']);
        Route::put('/quotes/{quote}', [Admin\QuoteController::class, 'update']);
        Route::post('/quotes/{quote}/send', [Admin\QuoteController::class, 'send']);
        Route::post('/quotes/{quote}/convert-to-invoice', [Admin\QuoteController::class, 'convertToInvoice']);
        Route::get('/quotes/{quote}/download', [Admin\QuoteController::class, 'download']);

        Route::get('/invoices', [Admin\InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [Admin\InvoiceController::class, 'show']);
        Route::post('/invoices/{invoice}/send-to-accountant', [Admin\InvoiceController::class, 'sendToAccountant']);
        Route::post('/invoices/{invoice}/cancel', [Admin\InvoiceController::class, 'cancel']);
        Route::get('/invoices/{invoice}/download', [Admin\InvoiceController::class, 'download']);

        Route::get('/clients', [Admin\ClientController::class, 'index']);
        Route::get('/clients/{user}', [Admin\ClientController::class, 'show']);
        Route::patch('/clients/{user}/toggle', [Admin\ClientController::class, 'toggleActive']);

        Route::get('/settings', [Admin\SettingsController::class, 'show']);
        Route::put('/settings', [Admin\SettingsController::class, 'update']);

        Route::get('/admins', fn() => \App\Http\Resources\UserResource::collection(
            \App\Models\User::admins()->get()
        ));
    });

    // ─── ACCOUNTANT ──────────────────────────────────────────────────────────
    Route::middleware('role.accountant')->prefix('accountant')->group(function () {
        Route::get('/dashboard', Accountant\DashboardController::class);

        Route::get('/invoices', [Accountant\InvoiceController::class, 'index']);
        Route::get('/invoices/{invoice}', [Accountant\InvoiceController::class, 'show']);
        Route::post('/invoices/{invoice}/validate', [Accountant\InvoiceController::class, 'validate']);
        Route::post('/invoices/{invoice}/cancel', [Accountant\InvoiceController::class, 'cancel']);
        Route::get('/invoices/{invoice}/download', [Accountant\InvoiceController::class, 'download']);
        Route::get('/invoices/export/csv', [Accountant\InvoiceController::class, 'export']);

        Route::get('/payments', [Accountant\PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [Accountant\PaymentController::class, 'show']);
        Route::post('/payments/{payment}/accept', [Accountant\PaymentController::class, 'accept']);
        Route::post('/payments/{payment}/reject', [Accountant\PaymentController::class, 'reject']);
        Route::post('/payments/{payment}/generate-receipt', [Accountant\PaymentController::class, 'generateReceipt']);

        Route::get('/reports/revenue', [Accountant\ReportController::class, 'revenue']);
        Route::get('/reports/taxes', [Accountant\ReportController::class, 'taxes']);
        Route::get('/reports/unpaid-invoices', [Accountant\ReportController::class, 'unpaidInvoices']);
        Route::get('/reports/service-revenue', [Accountant\ReportController::class, 'serviceRevenue']);
        Route::get('/reports/client-revenue', [Accountant\ReportController::class, 'clientRevenue']);
    });
});
