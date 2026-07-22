<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'couleur',
    ];

    public function membres()
    {
        return $this->hasMany(Membre::class, 'commission_id');
    }

    public function messagesGroupes()
    {
        return $this->hasMany(MessageGroupe::class, 'groupe_id');
    }
}
