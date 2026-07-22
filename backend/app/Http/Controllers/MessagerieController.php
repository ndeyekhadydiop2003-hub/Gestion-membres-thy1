<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageGroupeRequest;
use App\Http\Resources\MessageGroupeResource;
use App\Jobs\EnvoyerMessageGroupeJob;
use App\Models\DestinataireMessage;
use App\Models\Commission;
use App\Models\Membre;
use App\Models\MessageGroupe;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessagerieController extends Controller
{
    // Liste des "audiences" possibles : tous les membres + chaque groupe avec son nombre de membres
    public function destinataires()
    {
        $this->authorize('viewAny', MessageGroupe::class);

        $totalMembres = Membre::where('statut', 'actif')->count();

        $groupes = Commission::withCount(['membres' => function ($q) {
            $q->where('statut', 'actif');
        }])->orderBy('nom')->get();

        return response()->json([
            'tous_les_membres' => $totalMembres,
            'groupes' => $groupes->map(fn ($g) => [
                'id' => $g->id,
                'nom' => $g->nom,
                'couleur' => $g->couleur,
                'nombre_membres' => $g->membres_count,
            ]),
        ]);
    }

    // Historique des campagnes (tableau "Campagnes récentes")
    public function index()
    {
        $this->authorize('viewAny', MessageGroupe::class);

        $messages = MessageGroupe::with('groupe')
            ->withCount('destinataires')
            ->orderByDesc('created_at')
            ->paginate(10);

        return MessageGroupeResource::collection($messages);
    }

    public function show(MessageGroupe $message)
    {
        $this->authorize('view', $message);

        $message->load('groupe', 'expediteur');
        $message->loadCount([
            'destinataires as envoyes_count' => fn ($q) => $q->where('statut', 'envoye'),
            'destinataires as echoues_count' => fn ($q) => $q->where('statut', 'echoue'),
        ]);

        return new MessageGroupeResource($message);
    }

    // Création + envoi (ou programmation) d'une campagne
    public function store(StoreMessageGroupeRequest $request)
    {
        $donnees = $request->validated();

        $message = DB::transaction(function () use ($donnees) {
            $envoyerMaintenant = $donnees['envoyer_maintenant'] ?? true;
            $programmeLe = $donnees['programme_le'] ?? null;

            $nouveauMessage = MessageGroupe::create([
                'expediteur_id' => Auth::id(),
                'sujet' => $donnees['sujet'],
                'contenu' => $donnees['contenu'],
                'type_cible' => $donnees['type_cible'],
                'groupe_id' => $donnees['groupe_id'] ?? null,
                'statut' => $programmeLe ? 'pending' : ($envoyerMaintenant ? 'pending' : 'pending'),
            ]);

            // Construire la liste des destinataires (membres actifs uniquement)
            $membresQuery = Membre::where('statut', 'actif');
            if ($donnees['type_cible'] === 'groupe') {
                $membresQuery->where('commission_id', $donnees['groupe_id']);
            }
            $membres = $membresQuery->get(['id']);

            $lignes = $membres->map(fn ($membre) => [
                'bulk_message_id' => $nouveauMessage->id,
                'member_id' => $membre->id,
                'statut' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            if (!empty($lignes)) {
                DestinataireMessage::insert($lignes);
            }

            return $nouveauMessage;
        });

        // Envoi immédiat ou programmé via une Job (en file d'attente, pour ne pas bloquer la requête HTTP)
        if (!empty($donnees['programme_le'])) {
            EnvoyerMessageGroupeJob::dispatch($message)->delay($donnees['programme_le']);
        } else {
            EnvoyerMessageGroupeJob::dispatch($message);
        }

        return new MessageGroupeResource($message->load('groupe')->loadCount('destinataires'));
    }

    // Enregistrer en brouillon sans envoyer
    public function brouillon(StoreMessageGroupeRequest $request)
    {
        $donnees = $request->validated();

        $message = MessageGroupe::create([
            'expediteur_id' => Auth::id(),
            'sujet' => $donnees['sujet'],
            'contenu' => $donnees['contenu'],
            'type_cible' => $donnees['type_cible'],
            'groupe_id' => $donnees['groupe_id'] ?? null,
            'statut' => 'brouillon',
        ]);

        return new MessageGroupeResource($message);
    }

    public function destroy(MessageGroupe $message)
    {
        $this->authorize('delete', $message);

        $message->delete();

        return response()->json(['message' => 'Campagne supprimée avec succès.']);
    }
}
