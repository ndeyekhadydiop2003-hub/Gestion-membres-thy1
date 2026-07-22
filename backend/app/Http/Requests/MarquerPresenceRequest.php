<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarquerPresenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Presence::class);
    }

    public function rules(): array
    {
        return [
            'presences' => 'required|array|min:1',
            'presences.*.membre_id' => 'required|exists:membres,id',
            'presences.*.statut' => 'required|in:present,absent',
        ];
    }

    public function messages(): array
    {
        return [
            'presences.required' => 'Au moins une présence doit être renseignée.',
            'presences.*.membre_id.exists' => "Un des membres sélectionnés n'existe pas.",
        ];
    }
}
