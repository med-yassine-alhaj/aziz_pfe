<?php

namespace App\Policies;

use App\Models\ServiceRequest;
use App\Models\User;

class ServiceRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ServiceRequest $request): bool
    {
        if ($user->isAdmin() || $user->isAccountant()) return true;
        return $user->id === $request->client_id;
    }

    public function create(User $user): bool
    {
        return $user->isClient();
    }

    public function update(User $user, ServiceRequest $request): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, ServiceRequest $request): bool
    {
        return $user->isAdmin();
    }
}
