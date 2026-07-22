<?php

namespace App\Policies;

use App\Models\Commission;
use App\Models\User;

class CommissionPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Commission $commission): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        // Création/gestion des commissions réservée au Super Admin
        return $user->estSuperAdmin();
    }

    public function update(User $user, Commission $commission): bool
    {
        return $user->estSuperAdmin();
    }

    public function delete(User $user, Commission $commission): bool
    {
        return $user->estSuperAdmin();
    }
}
