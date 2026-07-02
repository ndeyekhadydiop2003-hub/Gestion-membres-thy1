<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seance extends Model
{
    protected $fillable = ['programme_id', 'date_seance', 'heure_debut', 'lieu', 'statut', 'cree_par'];

    protected function casts(): array
    {
        return [
            'date_seance' => 'date',
        ];
    }

    public function programme()
    {
        return $this->belongsTo(Programme::class, 'programme_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'seance_id');
    }

    // Raccourcis utiles pour le dashboard
    public function getNombrePresentsAttribute(): int
    {
        return $this->presences()->where('statut', 'present')->count();
    }

    public function getNombreAbsentsAttribute(): int
    {
        return $this->presences()->where('statut', 'absent')->count();
    }
}
