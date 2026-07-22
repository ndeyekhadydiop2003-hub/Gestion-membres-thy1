<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarquerPresenceRequest;
use App\Http\Resources\PresenceResource;
use App\Models\Presence;
use App\Models\Seance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    // Liste des présences d'une séance précise (utilisé pour afficher le tableau membre/présence)
    public function index(Seance $seance)
    {
        $this->authorize('view', $seance);

        $presences = Presence::with('membre')
            ->where('seance_id', $seance->id)
            ->get();

        return PresenceResource::collection($presences);
    }

    // Marquage en masse (le bouton Présent/Absent pour chaque membre, envoyé groupé)
    // Modifiable à tout moment : un nouveau marquage remplace simplement l'ancien.
    public function marquer(MarquerPresenceRequest $request, Seance $seance)
    {
        $donnees = $request->validated();

        DB::transaction(function () use ($donnees, $seance) {
            foreach ($donnees['presences'] as $ligne) {
                Presence::updateOrCreate(
                    [
                        'seance_id' => $seance->id,
                        'membre_id' => $ligne['membre_id'],
                    ],
                    [
                        'statut' => $ligne['statut'],
                        'marque_par' => Auth::id(),
                    ]
                );
            }
        });

        $seance->loadCount([
            'presences as presents_count' => fn ($q) => $q->where('statut', 'present'),
            'presences as absents_count' => fn ($q) => $q->where('statut', 'absent'),
        ]);

        return response()->json([
            'message' => 'Présences enregistrées avec succès.',
            'presents' => $seance->presents_count,
            'absents' => $seance->absents_count,
        ]);
    }

    // Marquer un seul membre (clic sur un bouton Présent/Absent individuel).
    // Modifiable à tout moment : re-cliquer change simplement le statut enregistré.
    public function marquerUnique(Seance $seance, \App\Models\Membre $membre, Request $request)
    {
        $this->authorize('create', Presence::class);

        $request->validate([
            'statut' => 'required|in:present,absent',
        ]);

        $presence = Presence::updateOrCreate(
            [
                'seance_id' => $seance->id,
                'membre_id' => $membre->id,
            ],
            [
                'statut' => $request->statut,
                'marque_par' => Auth::id(),
            ]
        );

        return new PresenceResource($presence->load('membre'));
    }

    // Ajouter un participant "autre" : une personne présente à la séance mais qui n'est pas
    // enregistrée dans la base des membres. Toujours comptée comme "présente".
    // La section et le sexe sont obligatoires pour permettre la répartition.
    public function ajouterAutre(Request $request, Seance $seance)
    {
        $this->authorize('create', Presence::class);

        $donnees = $request->validate([
            'nom_autre' => 'required|string|max:150',
            'section' => 'required|in:1,2,3',
            'sexe' => 'required|in:M,F',
        ]);

        $presence = Presence::create([
            'seance_id' => $seance->id,
            'membre_id' => null,
            'nom_autre' => $donnees['nom_autre'],
            'section' => $donnees['section'],
            'sexe' => $donnees['sexe'],
            'statut' => 'present',
            'marque_par' => Auth::id(),
        ]);

        return new PresenceResource($presence);
    }

    // Retirer un participant "autre" ajouté par erreur
    public function supprimerAutre(Seance $seance, Presence $presence)
    {
        $this->authorize('create', Presence::class);

        if (!$presence->est_autre || $presence->seance_id !== $seance->id) {
            return response()->json(['message' => "Ce participant n'existe pas pour cette séance."], 404);
        }

        $presence->delete();

        return response()->json(['message' => 'Participant retiré avec succès.']);
    }

    public function membresAvecPresence(Request $request, Seance $seance)
    {
        $this->authorize('view', $seance);

        $query = \App\Models\Membre::where('statut', 'actif');

        if ($request->filled('recherche')) {
            $recherche = $request->recherche;
            $query->where(function ($q) use ($recherche) {
                $q->where('nom', 'like', "%{$recherche}%")
                  ->orWhere('prenom', 'like', "%{$recherche}%")
                  ->orWhere('email', 'like', "%{$recherche}%");
            });
        }

        $membres = $query->orderBy('nom')->get();
        $presences = Presence::where('seance_id', $seance->id)->whereNotNull('membre_id')->pluck('statut', 'membre_id');

        $data = $membres->map(fn ($m) => [
            'id' => $m->id,
            'identifiant' => 'TY-' . str_pad($m->id, 5, '0', STR_PAD_LEFT),
            'nom' => $m->nom,
            'prenom' => $m->prenom,
            'profession' => $m->profession,
            'email' => $m->email,
            'statut_presence' => $presences[$m->id] ?? null,
        ]);

        // Participants "autres" (hors base) déjà ajoutés pour cette séance
        $autres = Presence::whereNull('membre_id')
            ->where('seance_id', $seance->id)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nom_autre' => $p->nom_autre,
                'section' => $p->section,
                'sexe' => $p->sexe,
            ]);

        return response()->json([
            'data' => $data,
            'total' => $membres->count(),
            'autres' => $autres,
            'repartition' => $this->calculerRepartition($seance),
        ]);
    }

    // Répartition Section × Sexe de toutes les personnes PRÉSENTES à la séance
    // (membres enregistrés + participants "autres"), indépendamment de la recherche affichée.
    private function calculerRepartition(Seance $seance): array
    {
        $repartition = [
            '1' => ['M' => 0, 'F' => 0],
            '2' => ['M' => 0, 'F' => 0],
            '3' => ['M' => 0, 'F' => 0],
        ];

        // Membres présents : section calculée depuis leur âge, sexe depuis leur fiche
        $membresPresents = Presence::where('seance_id', $seance->id)
            ->where('statut', 'present')
            ->whereNotNull('membre_id')
            ->with('membre')
            ->get();

        foreach ($membresPresents as $p) {
            if (!$p->membre) {
                continue;
            }
            $section = Presence::sectionPourAge($p->membre->age);
            $sexe = $p->membre->sexe;
            if ($section && in_array($sexe, ['M', 'F'])) {
                $repartition[$section][$sexe]++;
            }
        }

        // Participants "autres" : section et sexe saisis manuellement à l'ajout
        $autresPresents = Presence::where('seance_id', $seance->id)
            ->whereNull('membre_id')
            ->get();

        foreach ($autresPresents as $p) {
            if ($p->section && in_array($p->sexe, ['M', 'F'])) {
                $repartition[$p->section][$p->sexe]++;
            }
        }

        return $repartition;
    }
}
