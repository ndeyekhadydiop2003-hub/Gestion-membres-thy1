<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = ['seance_id', 'membre_id', 'statut', 'marque_par'];

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
}
