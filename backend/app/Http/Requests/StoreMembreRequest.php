<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMembreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Membre::class);
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'sexe' => 'required|in:M,F',
            'date_naissance' => 'nullable|date|before:today',
            'niveau' => 'nullable|string|max:100',
            'profession' => 'nullable|string|max:150',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150|unique:membres,email',
            'date_adhesion' => 'required|date',
            'photo' => 'nullable|image|max:2048', // upload, 2 Mo max
            'groupe_id' => 'nullable|exists:groupes,id',
            'statut' => 'nullable|in:actif,inactif,suspendu',

            // Données sensibles (optionnelles à la création, gérées séparément)
            'nin' => 'nullable|string|max:50',
            'numero_electeur' => 'nullable|string|max:50',
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'sexe.required' => 'Le sexe est obligatoire.',
            'sexe.in' => 'Le sexe doit être M ou F.',
            'email.unique' => 'Cet email est déjà utilisé par un autre membre.',
            'date_adhesion.required' => "La date d'adhésion est obligatoire.",
            'photo.image' => 'Le fichier doit être une image.',
            'photo.max' => 'La photo ne doit pas dépasser 2 Mo.',
            'groupe_id.exists' => "Le groupe sélectionné n'existe pas.",
        ];
    }
}
