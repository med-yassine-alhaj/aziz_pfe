<?php

namespace App\Policies;

use App\Models\Quote;
use App\Models\User;

class QuotePolicy
{
    public function view(User $user, Quote $quote): bool
    {
        if ($user->isAdmin()) return true;
        if ($user->isAccountant()) return true;
        return $user->id === $quote->client_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Quote $quote): bool
    {
        return $user->isAdmin() && in_array($quote->status, ['draft', 'sent']);
    }

    public function respond(User $user, Quote $quote): bool
    {
        return $user->id === $quote->client_id && $quote->status === 'sent';
    }
}
