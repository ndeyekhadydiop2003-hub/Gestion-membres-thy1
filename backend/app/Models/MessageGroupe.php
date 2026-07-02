<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageGroupe extends Model
{
    protected $table = 'messages_groupes';

    protected $fillable = [
        'expediteur_id',
        'sujet',
        'contenu',
        'type_cible',
        'groupe_id',
        'statut',
        'envoye_le',
    ];

    protected function casts(): array
    {
        return [
            'envoye_le' => 'datetime',
        ];
    }

    public function expediteur()
    {
        return $this->belongsTo(User::class, 'expediteur_id');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }

    public function destinataires()
    {
        return $this->hasMany(DestinataireMessage::class, 'message_groupe_id');
    }
}
