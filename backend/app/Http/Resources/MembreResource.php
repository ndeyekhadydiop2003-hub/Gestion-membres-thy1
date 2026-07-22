<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MembreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'identifiant' => 'TY-' . str_pad($this->id, 5, '0', STR_PAD_LEFT),
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'sexe' => $this->sexe,
            'age' => $this->age, // attribut calculé sur le modèle
            'date_naissance' => $this->date_naissance?->format('Y-m-d'),
            'niveau' => $this->niveau,
            'profession' => $this->profession,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'date_adhesion' => $this->date_adhesion?->format('Y-m-d'),
            'photo_url' => $this->photo_chemin ? asset('storage/' . $this->photo_chemin) : null,
            'statut' => $this->statut,
            'commission' => $this->whenLoaded('commission', fn () => [
                'id' => $this->commission->id,
                'nom' => $this->commission->nom,
                'couleur' => $this->commission->couleur,
            ]),
            'donnees_sensibles' => $this->whenLoaded('donneesSensibles', fn () => $this->donneesSensibles ? [
                'nin' => $this->donneesSensibles->nin,
                'numero_electeur' => $this->donneesSensibles->numero_electeur,
                'groupe_sanguin' => $this->donneesSensibles->groupe_sanguin,
            ] : null),
            'cree_le' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
