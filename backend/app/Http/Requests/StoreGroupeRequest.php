<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Groupe::class);
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:100|unique:groupes,nom',
            'description' => 'nullable|string|max:500',
            'couleur' => 'nullable|string|max:7', // ex: #1e3a5f
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du groupe est obligatoire.',
            'nom.unique' => 'Un groupe avec ce nom existe déjà.',
        ];
    }
}
