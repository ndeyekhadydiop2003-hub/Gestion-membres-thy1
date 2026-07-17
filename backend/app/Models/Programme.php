<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    protected $fillable = ['nom', 'description', 'jour_semaine', 'actif','couleur', 'cree_par'];

    public function seances()
    {
        return $this->hasMany(Seance::class, 'programme_id');
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'cree_par');
    }
}
