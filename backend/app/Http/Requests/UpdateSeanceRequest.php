<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('seance'));
    }

    public function rules(): array
    {
        return [
            'date_seance' => 'sometimes|required|date',
            'heure_debut' => 'nullable|date_format:H:i',
            'heure_fin' => 'nullable|date_format:H:i|after:heure_debut',
            'lieu' => 'nullable|string|max:150',
            'statut' => 'nullable|in:planifiee,terminee,annulee',
        ];
    }
}
