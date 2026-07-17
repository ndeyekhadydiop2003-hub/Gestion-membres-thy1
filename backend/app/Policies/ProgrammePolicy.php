<?php

namespace App\Policies;

use App\Models\Programme;
use App\Models\User;

class ProgrammePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Programme $programme): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function update(User $user, Programme $programme): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function delete(User $user, Programme $programme): bool
    {
        return $user->estSuperAdmin();
    }
}
