<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'programme' => $this->whenLoaded('programme', fn () => [
                'id' => $this->programme->id,
                'nom' => $this->programme->nom,
                'couleur' => $this->programme->couleur,
            ]),
            'date_seance' => $this->date_seance?->format('Y-m-d'),
            'heure_debut' => $this->heure_debut,
            'heure_fin' => $this->heure_fin,
            'lieu' => $this->lieu,
            'statut' => $this->statut,
            'presents' => $this->presents_count ?? null,
            'absents' => $this->absents_count ?? null,
            'excuses' => $this->excuses_count ?? null,
            'presences' => PresenceResource::collection($this->whenLoaded('presences')),
        ];
    }
}
