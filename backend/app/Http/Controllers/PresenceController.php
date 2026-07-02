<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarquerPresenceRequest;
use App\Http\Resources\PresenceResource;
use App\Models\Presence;
use App\Models\Seance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

    // Marquage en masse (le bouton Présent/Absent/Excusé pour chaque membre, envoyé groupé)
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
            'presences as excuses_count' => fn ($q) => $q->where('statut', 'excuse'),
        ]);

        return response()->json([
            'message' => 'Présences enregistrées avec succès.',
            'presents' => $seance->presents_count,
            'absents' => $seance->absents_count,
            'excuses' => $seance->excuses_count,
        ]);
    }

    // Marquer un seul membre rapidement (clic sur un bouton Présent/Absent/Excusé individuel)
    public function marquerUnique(Seance $seance, \App\Models\Membre $membre, \Illuminate\Http\Request $request)
    {
        $this->authorize('create', Presence::class);

        $request->validate([
            'statut' => 'required|in:present,absent,excuse',
        ]);

        $presence = Presence::updateOrCreate(
            ['seance_id' => $seance->id, 'membre_id' => $membre->id],
            ['statut' => $request->statut, 'marque_par' => Auth::id()]
        );

        return new PresenceResource($presence->load('membre'));
    }
}
