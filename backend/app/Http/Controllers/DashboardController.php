<?php

namespace App\Http\Controllers;

use App\Models\DonneeSensibleMembre;
use App\Models\JournalActivite;
use App\Models\Membre;
use App\Models\MessageGroupe;
use App\Models\Presence;
use App\Models\Programme;
use App\Models\Seance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function statistiques(Request $request)
    {
        $user = $request->user();

        // --- 1. Statistiques Globales ---
        $totalMembres = Membre::where('statut', 'actif')->count();

        $nouvellesAdhesions = Membre::where('statut', 'actif')
            ->whereMonth('date_adhesion', now()->month)
            ->whereYear('date_adhesion', now()->year)
            ->count();

        $messagesEnvoyes = MessageGroupe::where('statut', 'envoye')->count();

        $seancesTenues = Seance::whereYear('date_seance', now()->year)
            ->whereMonth('date_seance', '>=', now()->startOfQuarter()->month)
            ->count();

        // --- 2. Évolution & Répartitions ---
        $adhesionsParMois = Membre::selectRaw('MONTH(date_adhesion) as mois, YEAR(date_adhesion) as annee, COUNT(*) as total')
            ->where('date_adhesion', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('annee', 'mois')
            ->orderBy('annee')
            ->orderBy('mois')
            ->get()
            ->map(fn ($ligne) => [
                'mois' => Carbon::create($ligne->annee, $ligne->mois, 1)->translatedFormat('M'),
                'total' => $ligne->total,
            ]);

        $repartitionSexe = Membre::where('statut', 'actif')
            ->selectRaw('sexe, COUNT(*) as total')
            ->groupBy('sexe')
            ->get();

        // --- 3. Tranches d'âge ---
        $tranchesAge = [
            '0-12'  => 0,
            '13-17' => 0,
            '18-25' => 0,
            '26-35' => 0,
            '36-45' => 0,
            '46-55' => 0,
            '56-65' => 0,
            '65+'   => 0
        ];

        Membre::where('statut', 'actif')
            ->whereNotNull('date_naissance')
            ->get()
            ->each(function ($membre) use (&$tranchesAge) {
                $age = $membre->age; // Suppose que 'age' est un attribut calculé (Accessor) dans le modèle Membre
                if ($age === null) {
                    return;
                }

                if ($age <= 12) {
                    $tranchesAge['0-12']++;
                } elseif ($age <= 17) {
                    $tranchesAge['13-17']++;
                } elseif ($age <= 25) {
                    $tranchesAge['18-25']++;
                } elseif ($age <= 35) {
                    $tranchesAge['26-35']++;
                } elseif ($age <= 45) {
                    $tranchesAge['36-45']++;
                } elseif ($age <= 55) {
                    $tranchesAge['46-55']++;
                } elseif ($age <= 65) {
                    $tranchesAge['56-65']++;
                } else {
                    $tranchesAge['65+']++;
                }
            });

        $tranchesAge = collect($tranchesAge)
            ->map(fn ($total, $tranche) => ['tranche' => $tranche, 'total' => $total])
            ->values();

        // --- 4. Données sensibles (Soumis à autorisation) ---
        $repartitionGroupeSanguin = null;
        if ($user && $user->can('view', new DonneeSensibleMembre())) {
            $repartitionGroupeSanguin = DonneeSensibleMembre::selectRaw('groupe_sanguin, COUNT(*) as total')
                ->whereNotNull('groupe_sanguin')
                ->groupBy('groupe_sanguin')
                ->get();
        }

        // --- 5. Taux de présence par programme ---
        $presenceParProgramme = Programme::all()
            ->map(function ($programme) {
                $total = Presence::whereHas('seance', fn ($q) => $q->where('programme_id', $programme->id))->count();
                $presents = Presence::whereHas('seance', fn ($q) => $q->where('programme_id', $programme->id))
                    ->where('statut', 'present')
                    ->count();

                return [
                    'programme' => $programme->nom,
                    'taux_presence' => $total > 0 ? (int) round(($presents / $total) * 100) : 0,
                ];
            })
            ->sortByDesc('taux_presence')
            ->values()
            ->take(6);

        // --- 6. Listes récentes ---
        $derniersMembres = Membre::with('groupe')
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn ($membre) => [
                'id' => $membre->id,
                'identifiant' => 'TY-' . str_pad($membre->id, 5, '0', STR_PAD_LEFT),
                'nom' => $membre->nom,
                'prenom' => $membre->prenom,
                'profession' => $membre->profession,
                'date_adhesion' => $membre->date_adhesion?->format('d M Y'),
                'statut' => $membre->statut,
                'photo_url' => $membre->photo_chemin ? asset('storage/' . $membre->photo_chemin) : null,
            ]);

        $activiteRecente = JournalActivite::with('utilisateur')
            ->orderByDesc('created_at')
            ->take(6)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'utilisateur' => $log->utilisateur?->nom ?? 'Système',
                'action' => $log->action,
                'cree_le' => $log->created_at->diffForHumans(),
            ]);

        // --- 7. Réponse JSON ---
        return response()->json([
            'total_membres' => $totalMembres,
            'nouvelles_adhesions' => $nouvellesAdhesions,
            'messages_envoyes' => $messagesEnvoyes,
            'seances_tenues' => $seancesTenues,
            'adhesions_par_mois' => $adhesionsParMois,
            'repartition_sexe' => $repartitionSexe,
            'tranches_age' => $tranchesAge,
            'repartition_groupe_sanguin' => $repartitionGroupeSanguin,
            'presence_par_programme' => $presenceParProgramme,
            'derniers_membres' => $derniersMembres,
            'activite_recente' => $activiteRecente,
        ]);
    }
}
