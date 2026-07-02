<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgrammeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('programme'));
    }

    public function rules(): array
    {
        return [
            'nom' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string|max:500',
            'jour_semaine' => 'nullable|in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
            'couleur' => 'nullable|string|max:7',
            'actif' => 'nullable|boolean',
        ];
    }
}
