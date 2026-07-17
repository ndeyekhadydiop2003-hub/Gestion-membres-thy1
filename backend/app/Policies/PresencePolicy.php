<?php

namespace App\Policies;

use App\Models\Presence;
use App\Models\User;

class PresencePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Presence $presence): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }
}
