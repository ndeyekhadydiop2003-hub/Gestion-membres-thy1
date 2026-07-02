<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        // Seul le Super Admin gère les comptes admins
        return $user->estSuperAdmin();
    }

    public function view(User $user, User $cible): bool
    {
        return $user->estSuperAdmin() || $user->id === $cible->id;
    }

    public function create(User $user): bool
    {
        return $user->estSuperAdmin();
    }

    public function update(User $user, User $cible): bool
    {
        // Un admin peut modifier son propre profil, mais pas celui des autres
        return $user->estSuperAdmin() || $user->id === $cible->id;
    }

    public function delete(User $user, User $cible): bool
    {
        // On ne peut pas se supprimer soi-même par erreur
        return $user->estSuperAdmin() && $user->id !== $cible->id;
    }

    public function gererRole(User $user, User $cible): bool
    {
        // Changer le rôle d'un utilisateur (admin <-> super_admin) : Super Admin uniquement
        return $user->estSuperAdmin();
    }
}
