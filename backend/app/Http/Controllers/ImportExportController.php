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

        $erreurs = $import->errors();

        $statut = $erreurs->isEmpty() ? 'succes' : 'avertissement';

        HistoriqueOperation::create([
            'type' => 'import',
            'fichier' => $request->file('fichier')->getClientOriginalName(),
            'details' => $import->nombreImportes . ' lignes' . ($erreurs->isNotEmpty() ? ' — ' . $erreurs->count() . ' erreurs' : ''),
            'utilisateur_id' => Auth::id(),
            'statut' => $statut,
        ]);

        return response()->json([
            'message' => 'Import terminé.',
            'nombre_importes' => $import->nombreImportes,
            'erreurs' => $erreurs,
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
            ->paginate(10);

        return response()->json($operations);
    }

    public function telechargerModele()
    {
        return response()->download(storage_path('app/modeles/modele_import_membres.xlsx'));
    }
}
