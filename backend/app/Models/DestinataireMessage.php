<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DestinataireMessage extends Model
{
    protected $table = 'destinataires_messages';

    protected $fillable = [
        'message_groupe_id',
        'membre_id',
        'statut',
    ];

    public function messageGroupe()
    {
        return $this->belongsTo(MessageGroupe::class, 'message_groupe_id');
    }

    public function membre()
    {
        return $this->belongsTo(Membre::class, 'membre_id');
    }
}
