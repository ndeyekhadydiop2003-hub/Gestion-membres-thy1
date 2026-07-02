<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGroupeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('groupe'));
    }

    public function rules(): array
    {
        $groupeId = $this->route('groupe')->id;

        return [
            'nom' => [
                'sometimes', 'required', 'string', 'max:100',
                Rule::unique('groupes', 'nom')->ignore($groupeId),
            ],
            'description' => 'nullable|string|max:500',
            'couleur' => 'nullable|string|max:7',
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
