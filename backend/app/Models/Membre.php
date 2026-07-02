<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Membre extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
        'niveau',
        'profession',
        'telephone',
        'email',
        'date_adhesion',
        'photo_chemin',
        'statut',
        'groupe_id',
        'cree_par',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'date_adhesion' => 'date',
        ];
    }

    // Relations
    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'cree_par');
    }

    public function donneesSensibles()
    {
        return $this->hasOne(DonneeSensibleMembre::class, 'membre_id');
    }

    public function destinatairesMessages()
    {
        return $this->hasMany(DestinataireMessage::class, 'membre_id');
    }

    // Attribut calculé : âge à partir de la date de naissance
    public function getAgeAttribute(): ?int
    {
        return $this->date_naissance?->age;
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'membre_id');
    }
}
