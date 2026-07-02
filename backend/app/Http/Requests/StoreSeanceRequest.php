<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Seance::class);
    }

    public function rules(): array
    {
        return [
            'programme_id' => 'required|exists:programmes,id',
            'date_seance' => 'required|date',
            'heure_debut' => 'nullable|date_format:H:i',
            'lieu' => 'nullable|string|max:150',
            'statut' => 'nullable|in:planifiee,terminee,annulee',
        ];
    }

    public function messages(): array
    {
        return [
            'programme_id.required' => 'Le programme est obligatoire.',
            'programme_id.exists' => "Le programme sélectionné n'existe pas.",
            'date_seance.required' => 'La date de la séance est obligatoire.',
        ];
    }
}
