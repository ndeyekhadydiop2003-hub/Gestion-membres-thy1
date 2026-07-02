<?php

namespace App\Policies;

use App\Models\MessageGroupe;
use App\Models\User;

class MessageGroupePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function view(User $user, MessageGroupe $message): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function create(User $user): bool
    {
        // Envoi de messagerie groupée : Super Admin et Admin
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function delete(User $user, MessageGroupe $message): bool
    {
        // Seul l'expéditeur ou le Super Admin peut supprimer un message de l'historique
        return $user->estSuperAdmin() || $user->id === $message->expediteur_id;
    }
}
