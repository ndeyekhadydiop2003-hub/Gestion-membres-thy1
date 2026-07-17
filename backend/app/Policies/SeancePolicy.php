<?php

namespace App\Policies;

use App\Models\Seance;
use App\Models\User;

class SeancePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Seance $seance): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function update(User $user, Seance $seance): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function delete(User $user, Seance $seance): bool
    {
        return $user->estSuperAdmin();
    }
}
