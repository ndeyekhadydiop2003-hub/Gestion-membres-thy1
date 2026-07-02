<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonneeSensibleMembre extends Model
{
    protected $table = 'donnees_sensibles_membres';

    protected $fillable = [
        'membre_id',
        'nin',
        'numero_electeur',
        'groupe_sanguin',
    ];

    protected function casts(): array
    {
        return [
            'nin' => 'encrypted',
            'numero_electeur' => 'encrypted',
        ];
    }

    public function membre()
    {
        return $this->belongsTo(Membre::class, 'membre_id');
    }
}
