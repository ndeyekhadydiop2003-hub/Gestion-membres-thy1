<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = ['seance_id', 'membre_id', 'nom_autre', 'section', 'sexe', 'statut', 'marque_par'];

    public function seance()
    {
        return $this->belongsTo(Seance::class, 'seance_id');
    }

    public function membre()
    {
        return $this->belongsTo(Membre::class, 'membre_id');
    }

    public function marqueur()
    {
        return $this->belongsTo(User::class, 'marque_par');
    }

    // true si ce n'est pas un membre enregistré (participant "autre")
    public function getEstAutreAttribute(): bool
    {
        return is_null($this->membre_id);
    }

    // Calcule la section (1, 2 ou 3) à partir d'un âge donné
    public static function sectionPourAge(?int $age): ?string
    {
        if ($age === null) {
            return null;
        }

        if ($age < 13) {
            return '1';
        }

        if ($age <= 17) {
            return '2';
        }

        return '3';
    }

    public static function libellesSections(): array
    {
        return [
            '1' => 'Section 1 (moins de 13 ans)',
            '2' => 'Section 2 (13 à 17 ans)',
            '3' => 'Section 3 (18 ans et plus)',
        ];
    }
}
