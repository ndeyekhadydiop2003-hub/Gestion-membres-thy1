<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommissionRequest;
use App\Http\Requests\UpdateCommissionRequest;
use App\Http\Resources\CommissionResource;
use App\Models\Commission;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Commission::class);

        $commissions = Commission::withCount('membres')->orderBy('nom')->get();

        return CommissionResource::collection($commissions);
    }

    public function store(StoreCommissionRequest $request)
    {
        $commission = Commission::create($request->validated());

        return new CommissionResource($commission->loadCount('membres'));
    }

    public function show(Commission $commission)
    {
        $this->authorize('view', $commission);

        $commission->loadCount('membres');

        return new CommissionResource($commission);
    }

    public function update(UpdateCommissionRequest $request, Commission $commission)
    {
        $commission->update($request->validated());

        return new CommissionResource($commission->loadCount('membres'));
    }

    public function destroy(Commission $commission)
    {
        $this->authorize('delete', $commission);

        if ($commission->membres()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une commission qui contient encore des membres.',
            ], 422);
        }

        $commission->delete();

        return response()->json(['message' => 'Commission supprimée avec succès.']);
    }

    // Liste des membres d'une commission précise
    public function membres(Commission $commission)
    {
        $this->authorize('view', $commission);

        $membres = $commission->membres()
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

    // Ajout rapide d'un membre directement dans une commission (nom + prénom minimum)
    public function ajouterMembre(Request $request, Commission $commission)
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
            'commission_id' => $commission->id,
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
