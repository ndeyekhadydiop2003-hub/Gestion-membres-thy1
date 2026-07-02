<?php

namespace App\Policies;

use App\Models\DonneeSensibleMembre;
use App\Models\User;

class DonneeSensibleMembrePolicy
{


    public function create(User $user): bool
{
    // Admin ET Super Admin peuvent saisir les données sensibles à la création
    return in_array($user->role, ['super_admin', 'admin']);
}

public function update(User $user, DonneeSensibleMembre $donnee): bool
{
    // Admin ET Super Admin peuvent modifier les données sensibles
    return in_array($user->role, ['super_admin', 'admin']);
}

public function view(User $user, DonneeSensibleMembre $donnee): bool
{
    // Seul le Super Admin peut RELIRE NIN, n° électeur, groupe sanguin ensuite
    return $user->estSuperAdmin();
}



    public function delete(User $user, DonneeSensibleMembre $donnee): bool
    {
        return $user->estSuperAdmin();
    }

    // Règle spécifique : un Admin peut exporter la liste des membres,
    // mais JAMAIS avec les colonnes sensibles incluses
    public function inclureDansExport(User $user): bool
    {
        return $user->estSuperAdmin();
    }
}
