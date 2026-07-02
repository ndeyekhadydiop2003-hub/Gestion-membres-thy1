<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalActivite extends Model

 {
    protected $table = 'journaux_activite';
    const UPDATED_AT = null; // table append-only, jamais de mise à jour

    protected $fillable = [
        'utilisateur_id',
        'action',
        'type_sujet',
        'sujet_id',
        'details',
        'adresse_ip',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Relation polymorphique vers l'élément concerné (Membre, Groupe, etc.)
    public function sujet()
    {
        return $this->morphTo(__FUNCTION__, 'type_sujet', 'sujet_id');
    }
}
