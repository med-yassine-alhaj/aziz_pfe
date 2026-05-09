<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function view(User $user, Invoice $invoice): bool
    {
        if ($user->isAdmin() || $user->isAccountant()) return true;
        return $user->id === $invoice->client_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() && in_array($invoice->status, ['draft']);
    }

    public function validate(User $user, Invoice $invoice): bool
    {
        return $user->isAccountant() && $invoice->status === 'waiting_accountant_validation';
    }

    public function cancel(User $user, Invoice $invoice): bool
    {
        return ($user->isAdmin() || $user->isAccountant()) && $invoice->status !== 'paid';
    }
}
