<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCommissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('commission'));
    }

    public function rules(): array
    {
        $commissionId = $this->route('commission')->id;

        return [
            'nom' => [
                'sometimes', 'required', 'string', 'max:100',
                Rule::unique('commissions', 'nom')->ignore($commissionId),
            ],
            'description' => 'nullable|string|max:500',
            'couleur' => 'nullable|string|max:7',
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
