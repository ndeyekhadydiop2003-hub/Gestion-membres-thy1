<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupeRequest;
use App\Http\Requests\UpdateGroupeRequest;
use App\Http\Resources\GroupeResource;
use App\Models\Groupe;
use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Groupe::class);

        $groupes = Groupe::withCount('membres')->orderBy('nom')->get();

        return GroupeResource::collection($groupes);
    }

    public function store(StoreGroupeRequest $request)
    {
        $groupe = Groupe::create($request->validated());

        return new GroupeResource($groupe->loadCount('membres'));
    }

    public function show(Groupe $groupe)
    {
        $this->authorize('view', $groupe);

        $groupe->loadCount('membres');

        return new GroupeResource($groupe);
    }

    public function update(UpdateGroupeRequest $request, Groupe $groupe)
    {
        $groupe->update($request->validated());

        return new GroupeResource($groupe->loadCount('membres'));
    }

    public function destroy(Groupe $groupe)
    {
        $this->authorize('delete', $groupe);

        if ($groupe->membres()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un groupe qui contient encore des membres.',
            ], 422);
        }

        $groupe->delete();

        return response()->json(['message' => 'Groupe supprimé avec succès.']);
    }

    // Liste des membres d'un groupe précis
public function membres(Groupe $groupe)
{
    $this->authorize('view', $groupe);

    $membres = $groupe->membres()
        ->orderBy('nom')
        ->get()
        ->map(fn ($m) => [
            'id' => $m->id,
            'identifiant' => 'TY-' . str_pad($m->id, 5, '0', STR_PAD_LEFT),
            'nom' => $m->nom,
            'prenom' => $m->prenom,
            'telephone' => $m->telephone,
            'statut' => $m->statut,
            'photo_url' => $m->photo_chemin ? asset('storage/' . $m->photo_chemin) : null,
        ]);

    return response()->json(['data' => $membres]);
}

// Ajout rapide d'un membre directement dans un groupe (nom + prénom minimum)
public function ajouterMembre(Request $request, Groupe $groupe)
{
    $this->authorize('create', \App\Models\Membre::class);

    $donnees = $request->validate([
        'nom' => 'required|string|max:100',
        'prenom' => 'required|string|max:100',
        'sexe' => 'required|in:M,F',
        'telephone' => 'nullable|string|max:20',
    ]);

    $membre = \App\Models\Membre::create([
        ...$donnees,
        'groupe_id' => $groupe->id,
        'date_adhesion' => now(),
        'statut' => 'actif',
        'cree_par' => $request->user()->id,
    ]);

    return response()->json([
        'id' => $membre->id,
        'identifiant' => 'TY-' . str_pad($membre->id, 5, '0', STR_PAD_LEFT),
        'nom' => $membre->nom,
        'prenom' => $membre->prenom,
        'telephone' => $membre->telephone,
        'statut' => $membre->statut,
        'photo_url' => null,
    ], 201);
}
}
