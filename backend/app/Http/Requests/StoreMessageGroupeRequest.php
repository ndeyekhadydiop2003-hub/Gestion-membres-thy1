<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageGroupeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\MessageGroupe::class);
    }

    public function rules(): array
    {
        return [
            'sujet' => 'required|string|max:255',
            'contenu' => 'required|string',
            'type_cible' => 'required|in:tous,groupe',
            'groupe_id' => 'required_if:type_cible,groupe|nullable|exists:groupes,id',
            'envoyer_maintenant' => 'nullable|boolean',
            'programme_le' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'sujet.required' => 'Le sujet est obligatoire.',
            'contenu.required' => 'Le message ne peut pas être vide.',
            'type_cible.required' => 'Veuillez choisir les destinataires.',
            'groupe_id.required_if' => 'Veuillez sélectionner un groupe.',
            'programme_le.after' => "La date de programmation doit être dans le futur.",
        ];
    }
}
