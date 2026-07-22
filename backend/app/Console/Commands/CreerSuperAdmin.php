<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreerSuperAdmin extends Command
{
    protected $signature = 'admin:creer';
    protected $description = 'Crée un compte Super Admin (utile au tout premier déploiement)';

    public function handle(): int
    {
        $nom = $this->ask('Nom');
        $prenom = $this->ask('Prénom');
        $email = $this->ask('Email');
        $motDePasse = $this->secret('Mot de passe (min. 8 caractères)');

        $validateur = Validator::make(
            compact('nom', 'prenom', 'email', 'motDePasse'),
            [
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'motDePasse' => 'required|string|min:8',
            ]
        );

        if ($validateur->fails()) {
            foreach ($validateur->errors()->all() as $erreur) {
                $this->error($erreur);
            }
            return self::FAILURE;
        }

        User::create([
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'password' => Hash::make($motDePasse),
            'role' => 'super_admin',
        ]);

        $this->info("Compte Super Admin créé avec succès pour {$email}.");

        return self::SUCCESS;
    }
}
