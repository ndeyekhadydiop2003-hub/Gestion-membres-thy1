<?php

namespace App\Policies;

use App\Models\Groupe;
use App\Models\User;

class GroupePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Groupe $groupe): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        // Création/gestion des groupes réservée au Super Admin
        return $user->estSuperAdmin();
    }

    public function update(User $user, Groupe $groupe): bool
    {
        return $user->estSuperAdmin();
    }

    public function delete(User $user, Groupe $groupe): bool
    {
        return $user->estSuperAdmin();
    }
}
