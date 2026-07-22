<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMembreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('membre'));
    }

    public function rules(): array
    {
        $membreId = $this->route('membre')->id;

        return [
            'nom' => 'sometimes|required|string|max:100',
            'prenom' => 'sometimes|required|string|max:100',
            'sexe' => 'sometimes|required|in:M,F',
            'date_naissance' => 'nullable|date|before:today',
            'niveau' => 'nullable|string|max:100',
            'profession' => 'nullable|string|max:150',
            'telephone' => 'nullable|string|max:20',
            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('membres', 'email')->ignore($membreId),
            ],
            'date_adhesion' => 'sometimes|required|date',
            'photo' => 'nullable|image|max:2048',
            'commission_id' => 'nullable|exists:commissions,id',
            'statut' => 'nullable|in:actif,inactif,suspendu',

            'nin' => 'nullable|string|max:50',
            'numero_electeur' => 'nullable|string|max:50',
            'groupe_sanguin' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
        ];
    }

    public function messages(): array
    {
        return [
            'sexe.in' => 'Le sexe doit être M ou F.',
            'email.unique' => 'Cet email est déjà utilisé par un autre membre.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.max' => 'La photo ne doit pas dépasser 2 Mo.',
            'commission_id.exists' => "La commission sélectionnée n'existe pas.",
        ];
    }
}
