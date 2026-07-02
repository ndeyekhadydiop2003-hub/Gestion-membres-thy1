<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PresenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'membre' => $this->whenLoaded('membre', fn () => [
                'id' => $this->membre->id,
                'nom' => $this->membre->nom,
                'prenom' => $this->membre->prenom,
                'identifiant' => 'TY-' . str_pad($this->membre->id, 5, '0', STR_PAD_LEFT),
                'profession' => $this->membre->profession,
                'email' => $this->membre->email,
            ]),
            'statut' => $this->statut,
        ];
    }
}
