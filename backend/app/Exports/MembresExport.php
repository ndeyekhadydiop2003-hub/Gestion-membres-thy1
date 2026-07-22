<?php

namespace App\Exports;

use App\Models\Membre;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class MembresExport implements FromQuery, WithHeadings, WithMapping
{
    public function __construct(
        private array $colonnes,
        private bool $masquerSensibles,
        private ?int $commissionId = null
    ) {
    }

    public function query()
    {
        $query = Membre::query()->with(['commission', 'donneesSensibles']);

        if ($this->commissionId) {
            $query->where('commission_id', $this->commissionId);
        }

        return $query;
    }

    public function headings(): array
    {
        $entetes = [];

        if (in_array('nom_prenom', $this->colonnes)) $entetes[] = 'Nom & Prénom';
        if (in_array('sexe_age', $this->colonnes)) $entetes[] = 'Sexe / Âge';
        if (in_array('profession', $this->colonnes)) $entetes[] = 'Profession';
        if (in_array('telephone', $this->colonnes)) $entetes[] = 'Téléphone';
        if (in_array('email', $this->colonnes)) $entetes[] = 'Email';
        if (in_array('adhesion', $this->colonnes)) $entetes[] = 'Adhésion';
        if (in_array('niveau', $this->colonnes)) $entetes[] = 'Niveau';
        if (in_array('groupe_sanguin', $this->colonnes) && !$this->masquerSensibles) $entetes[] = 'Groupe sanguin';
        if (!$this->masquerSensibles) {
            $entetes[] = 'NIN';
            $entetes[] = 'Numéro électeur';
        }

        return $entetes;
    }

    public function map($membre): array
    {
        $ligne = [];

        if (in_array('nom_prenom', $this->colonnes)) $ligne[] = $membre->nom . ' ' . $membre->prenom;
        if (in_array('sexe_age', $this->colonnes)) $ligne[] = $membre->sexe . ' - ' . $membre->age . ' ans';
        if (in_array('profession', $this->colonnes)) $ligne[] = $membre->profession;
        if (in_array('telephone', $this->colonnes)) $ligne[] = $membre->telephone;
        if (in_array('email', $this->colonnes)) $ligne[] = $membre->email;
        if (in_array('adhesion', $this->colonnes)) $ligne[] = $membre->date_adhesion?->format('d/m/Y');
        if (in_array('niveau', $this->colonnes)) $ligne[] = $membre->niveau;

        if (in_array('groupe_sanguin', $this->colonnes) && !$this->masquerSensibles) {
            $ligne[] = $membre->donneesSensibles?->groupe_sanguin;
        }

        if (!$this->masquerSensibles) {
            $ligne[] = $membre->donneesSensibles?->nin;
            $ligne[] = $membre->donneesSensibles?->numero_electeur;
        }

        return $ligne;
    }
}
