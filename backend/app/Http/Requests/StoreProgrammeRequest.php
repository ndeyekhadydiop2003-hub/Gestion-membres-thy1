<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgrammeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Programme::class);
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:150',
            'description' => 'nullable|string|max:500',
            'jour_semaine' => 'nullable|in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'couleur' => 'nullable|string|max:7',
            'actif' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du programme est obligatoire.',
        ];
    }
}
