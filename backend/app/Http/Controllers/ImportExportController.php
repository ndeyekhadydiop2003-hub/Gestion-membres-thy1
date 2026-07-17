<?php

namespace App\Http\Controllers;

use App\Exports\MembresExport;
use App\Imports\MembresImport;
use App\Models\HistoriqueOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ImportExportController extends Controller
{
    public function importer(Request $request)
{
    $this->authorize('importer', \App\Models\Membre::class);

    $request->validate([
        'fichier' => 'required|file|mimes:xlsx,xls|max:5120',
    ]);

    $import = new MembresImport();
    Excel::import($import, $request->file('fichier'));

    $erreursValidation = collect($import->failures())->map(
        fn ($f) => "Ligne {$f->row()} : " . implode(', ', $f->errors())
    );
    $erreursTechniques = collect($import->errors())->map(
        fn ($e) => $e->getMessage()
    );
    $toutesErreurs = $erreursValidation->merge($erreursTechniques)->values();

    $statut = $toutesErreurs->isEmpty() ? 'succes' : 'avertissement';

    \App\Models\HistoriqueOperation::create([
        'type' => 'import',
        'fichier' => $request->file('fichier')->getClientOriginalName(),
        'details' => $import->nombreImportes . ' lignes' . ($toutesErreurs->isNotEmpty() ? ' — ' . $toutesErreurs->count() . ' erreurs' : ''),
        'utilisateur_id' => $request->user()->id,
        'statut' => $statut,
    ]);

    return response()->json([
        'message' => 'Import terminé.',
        'nombre_importes' => $import->nombreImportes,
        'erreurs' => $toutesErreurs,
    ]);
}

    public function exporter(Request $request)
    {
        $this->authorize('exporter', \App\Models\Membre::class);

        $donnees = $request->validate([
            'colonnes' => 'required|array',
            'masquer_sensibles' => 'required|boolean',
            'groupe_id' => 'nullable|exists:groupes,id',
        ]);

        // Sécurité : même si masquer_sensibles=false, on bloque si l'utilisateur n'a pas le droit
        $masquerSensibles = $donnees['masquer_sensibles'];
        if (!$masquerSensibles && !Auth::user()->can('inclureDansExport', \App\Models\DonneeSensibleMembre::class)) {
            $masquerSensibles = true;
        }

        $nomFichier = 'export_membres_' . now()->format('Y_m_d_His') . '.xlsx';

        HistoriqueOperation::create([
            'type' => 'export',
            'fichier' => $nomFichier,
            'details' => \App\Models\Membre::when($donnees['groupe_id'] ?? null, fn ($q, $id) => $q->where('groupe_id', $id))->count() . ' lignes',
            'utilisateur_id' => Auth::id(),
            'statut' => 'succes',
        ]);

        return Excel::download(
            new MembresExport($donnees['colonnes'], $masquerSensibles, $donnees['groupe_id'] ?? null),
            $nomFichier
        );
    }

    public function historique()
    {
        $operations = HistoriqueOperation::with('utilisateur')
            ->orderByDesc('created_at')
            ->take(20)
            ->get();

        return response()->json(['data' => $operations]);
    }

    public function telechargerModele()
    {
        return response()->download(storage_path('app/modeles/modele_import_membres.xlsx'));
    }

    public function importerProgrammes(Request $request)
{
    $this->authorize('create', \App\Models\Programme::class);

    $request->validate([
        'fichier' => 'required|file|mimes:xlsx,xls|max:5120',
    ]);

    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($request->file('fichier')->getPathname());
    $feuillesDisponibles = $spreadsheet->getSheetNames();

    $resultat = [
        'programmes_crees' => 0,
        'seances_creees' => 0,
        'presences_creees' => 0,
        'erreurs' => [],
    ];

    // ── Feuille "Programmes" ──────────────────────────────────────────
    $programmesParNom = [];
    if (in_array('Programmes', $feuillesDisponibles)) {
        foreach ($this->feuilleEnTableau($spreadsheet->getSheetByName('Programmes')) as $i => $ligne) {
            if (empty($ligne['nom'])) continue;

            $programme = \App\Models\Programme::firstOrCreate(
                ['nom' => $ligne['nom']],
                [
                    'description' => $ligne['description'] ?? null,
                    'jour_semaine' => $ligne['jour_semaine'] ?? null,
                    'couleur' => $ligne['couleur'] ?? '#2c4f7c',
                    'cree_par' => $request->user()->id,
                ]
            );
            $programmesParNom[$programme->nom] = $programme;
            if ($programme->wasRecentlyCreated) $resultat['programmes_crees']++;
        }
    }

    // ── Feuille "Seances" ──────────────────────────────────────────────
    $seancesParCle = [];
    if (in_array('Seances', $feuillesDisponibles)) {
        foreach ($this->feuilleEnTableau($spreadsheet->getSheetByName('Seances')) as $i => $ligne) {
            $nomProgramme = $ligne['programme'] ?? null;
            $date = $this->normaliserDate($ligne['date_seance'] ?? null);

            if (!$nomProgramme || !$date) continue;

            $programme = $programmesParNom[$nomProgramme] ?? \App\Models\Programme::where('nom', $nomProgramme)->first();
            if (!$programme) {
                $resultat['erreurs'][] = "Séances ligne " . ($i + 2) . " : programme '{$nomProgramme}' introuvable.";
                continue;
            }

            $seance = \App\Models\Seance::firstOrCreate(
                ['programme_id' => $programme->id, 'date_seance' => $date],
                [
                    'heure_debut' => $ligne['heure_debut'] ?? null,
                    'heure_fin' => $ligne['heure_fin'] ?? null,
                    'lieu' => $ligne['lieu'] ?? null,
                    'cree_par' => $request->user()->id,
                ]
            );
            $seancesParCle["{$nomProgramme}|{$date}"] = $seance;
            if ($seance->wasRecentlyCreated) $resultat['seances_creees']++;
        }
    }

    // ── Feuille "Presences" ─────────────────────────────────────────────
    if (in_array('Presences', $feuillesDisponibles)) {
        foreach ($this->feuilleEnTableau($spreadsheet->getSheetByName('Presences')) as $i => $ligne) {
            $nomProgramme = $ligne['programme'] ?? null;
            $identifiant = $ligne['membre_id'] ?? null;
            $statut = strtolower(trim($ligne['statut'] ?? ''));
            $date = $this->normaliserDate($ligne['date_seance'] ?? null);
            $numeroLigne = $i + 2;

            if (!$nomProgramme || !$identifiant || !$date || !in_array($statut, ['present', 'absent', 'excuse'])) {
                $resultat['erreurs'][] = "Présences ligne {$numeroLigne} : données invalides ou incomplètes.";
                continue;
            }

            $seance = $seancesParCle["{$nomProgramme}|{$date}"] ?? null;
            if (!$seance) {
                $resultat['erreurs'][] = "Présences ligne {$numeroLigne} : séance introuvable pour '{$nomProgramme}' le {$date}.";
                continue;
            }

            $membreId = (int) str_ireplace('TY-', '', trim($identifiant));
            $membre = \App\Models\Membre::find($membreId);
            if (!$membre) {
                $resultat['erreurs'][] = "Présences ligne {$numeroLigne} : membre '{$identifiant}' introuvable.";
                continue;
            }

            // Traçabilité : on ne modifie jamais une présence déjà enregistrée
            $dejaEnregistree = \App\Models\Presence::where('seance_id', $seance->id)
                ->where('membre_id', $membre->id)->exists();
            if ($dejaEnregistree) continue;

            \App\Models\Presence::create([
                'seance_id' => $seance->id,
                'membre_id' => $membre->id,
                'statut' => $statut,
                'marque_par' => $request->user()->id,
            ]);
            $resultat['presences_creees']++;
        }
    }

    \App\Models\HistoriqueOperation::create([
        'type' => 'import',
        'fichier' => $request->file('fichier')->getClientOriginalName(),
        'details' => "{$resultat['programmes_crees']} programmes, {$resultat['seances_creees']} séances, {$resultat['presences_creees']} présences",
        'utilisateur_id' => $request->user()->id,
        'statut' => empty($resultat['erreurs']) ? 'succes' : 'avertissement',
    ]);

    return response()->json($resultat);
}

private function feuilleEnTableau($feuille): array
{
    $lignesBrutes = array_values($feuille->toArray(null, true, true, false));
    if (empty($lignesBrutes)) return [];

    $entetes = array_map(
        fn ($v) => \Illuminate\Support\Str::snake(trim((string) $v)),
        array_values($lignesBrutes[0])
    );

    $lignes = [];
    foreach (array_slice($lignesBrutes, 1) as $ligne) {
        $valeurs = array_values($ligne);
        if (collect($valeurs)->filter(fn ($v) => $v !== null && $v !== '')->isEmpty()) continue;
        $lignes[] = array_combine($entetes, $valeurs);
    }
    return $lignes;
}

private function normaliserDate($valeur): ?string
{
    if (empty($valeur)) return null;
    if (is_numeric($valeur)) {
        return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($valeur)->format('Y-m-d');
    }
    try {
        return \Carbon\Carbon::parse($valeur)->format('Y-m-d');
    } catch (\Throwable) {
        return null;
    }
}
}
