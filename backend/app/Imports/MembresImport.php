<?php

namespace App\Imports;

use App\Models\Membre;
use App\Models\Groupe;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class MembresImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use SkipsErrors, SkipsFailures;

    public int $nombreImportes = 0;

    public function model(array $row)
    {
        $groupeId = null;
        if (!empty($row['groupe'])) {
            $groupe = Groupe::where('nom', $row['groupe'])->first();
            $groupeId = $groupe?->id;
        }

        $this->nombreImportes++;

        return new Membre([
            'nom' => $row['nom'],
            'prenom' => $row['prenom'],
            'sexe' => strtoupper($row['sexe']),
            'date_naissance' => $row['date_naissance'] ?? null,
            'niveau' => $row['niveau'] ?? null,
            'profession' => $row['profession'] ?? null,
            'telephone' => $row['telephone'] ?? null,
            'email' => $row['email'] ?? null,
            'date_adhesion' => $row['date_adhesion'] ?? now(),
            'groupe_id' => $groupeId,
            'statut' => 'actif',
            'cree_par' => Auth::id(),
        ]);
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'sexe' => 'required|in:M,F,m,f',
            'date_adhesion' => 'nullable|date',
            'email' => 'nullable|email',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'sexe.required' => 'Le sexe est obligatoire.',
            'sexe.in' => 'Le sexe doit être M ou F.',
        ];
    }
}
