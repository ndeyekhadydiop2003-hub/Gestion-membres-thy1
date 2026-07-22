<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Commission::class);
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:100|unique:commissions,nom',
            'description' => 'nullable|string|max:500',
            'couleur' => 'nullable|string|max:7', // ex: #1e3a5f
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de la commission est obligatoire.',
            'nom.unique' => 'Une commission avec ce nom existe déjà.',
        ];
    }
}
