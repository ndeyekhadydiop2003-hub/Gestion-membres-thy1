<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;



class User extends Authenticatable
{

    use Notifiable, HasApiTokens;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'secret_2fa',
        'confirmation_2fa_le',
        'derniere_connexion_le',
        'token_activation',
        'token_expire_le',
    ];

    protected $hidden = [
        'password', 'remember_token', 'secret_2fa', 'token_activation',
    ];

    protected function casts(): array
    {
        return [
            'confirmation_2fa_le' => 'datetime',
            'derniere_connexion_le' => 'datetime',
            'token_expire_le' => 'datetime',
            'password' => 'hashed',
            'secret_2fa' => 'encrypted',
        ];
    }

    // Relations
    public function membresCrees()
    {
        return $this->hasMany(Membre::class, 'cree_par');
    }

    public function journauxActivite()
    {
        return $this->hasMany(JournalActivite::class, 'utilisateur_id');
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(MessageGroupe::class, 'expediteur_id');
    }

    // Helpers
    public function estSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }
}
