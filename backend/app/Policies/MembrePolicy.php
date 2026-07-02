<?php

namespace App\Policies;

use App\Models\Membre;
use App\Models\User;

class MembrePolicy
{
    public function viewAny(User $user): bool
    {
        // Super Admin et Admin peuvent voir la liste des membres
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, Membre $membre): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function update(User $user, Membre $membre): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function delete(User $user, Membre $membre): bool
    {
        // Suppression (soft delete) : réservée au Super Admin pour plus de sécurité
        return $user->estSuperAdmin();
    }

    public function restore(User $user, Membre $membre): bool
    {
        return $user->estSuperAdmin();
    }

    public function forceDelete(User $user, Membre $membre): bool
    {
        // Suppression définitive : Super Admin uniquement, action irréversible
        return $user->estSuperAdmin();
    }

    public function exporter(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function importer(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }
}
