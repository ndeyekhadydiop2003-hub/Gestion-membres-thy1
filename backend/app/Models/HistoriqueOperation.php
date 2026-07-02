<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueOperation extends Model
{
    protected $table = 'historique_operations';

    protected $fillable = ['type', 'fichier', 'details', 'utilisateur_id', 'statut'];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
