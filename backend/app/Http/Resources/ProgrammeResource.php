<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgrammeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'description' => $this->description,
            'jour_semaine' => $this->jour_semaine,
            'couleur' => $this->couleur,
            'actif' => $this->actif,
            'nombre_seances' => $this->seances_count,
            'taux_presence' => $this->taux_presence ?? null,
            'seances' => SeanceResource::collection($this->whenLoaded('seances')),
        ];
    }
}
