<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageGroupeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sujet' => $this->sujet,
            'contenu' => $this->contenu,
            'type_cible' => $this->type_cible,
            'groupe' => $this->whenLoaded('groupe', fn () => $this->groupe ? [
                'id' => $this->groupe->id,
                'nom' => $this->groupe->nom,
            ] : null),
            'statut' => $this->statut,
            'destinataires_count' => $this->destinataires_count ?? null,
            'envoyes_count' => $this->envoyes_count ?? null,
            'taux_ouverture' => null, // nécessite un tracking pixel, voir remarque plus bas
            'envoye_le' => $this->envoye_le?->format('Y-m-d H:i'),
            'cree_le' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
