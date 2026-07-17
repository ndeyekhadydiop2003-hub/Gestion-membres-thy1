<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'role' => $this->role,
            'deux_fa_active' => !is_null($this->confirmation_2fa_le),
            'derniere_connexion' => $this->derniere_connexion_le?->diffForHumans(),
            'cree_le' => $this->created_at->format('Y-m-d'),

        ];
    }
}
