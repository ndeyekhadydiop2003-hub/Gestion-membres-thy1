<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeanceRequest;
use App\Http\Requests\UpdateSeanceRequest;
use App\Http\Resources\SeanceResource;
use App\Models\Seance;
use Illuminate\Support\Facades\Auth;

class SeanceController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Seance::class);

        $seances = Seance::with('programme')
            ->withCount([
                'presences as presents_count' => fn ($q) => $q->where('statut', 'present'),
                'presences as absents_count' => fn ($q) => $q->where('statut', 'absent'),
                'presences as excuses_count' => fn ($q) => $q->where('statut', 'excuse'),
            ])
            ->orderByDesc('date_seance')
            ->paginate(10);

        return SeanceResource::collection($seances);
    }

    public function store(StoreSeanceRequest $request)
    {
        $donnees = $request->validated();
        $donnees['cree_par'] = Auth::id();

        $seance = Seance::create($donnees);

        return new SeanceResource($seance->load('programme'));
    }

    public function show(Seance $seance)
    {
        $this->authorize('view', $seance);

        $seance->load(['programme', 'presences.membre']);

        return new SeanceResource($seance);
    }

    public function update(UpdateSeanceRequest $request, Seance $seance)
    {
        $seance->update($request->validated());

        return new SeanceResource($seance->load('programme'));
    }

    public function destroy(Seance $seance)
    {
        $this->authorize('delete', $seance);

        $seance->delete();

        return response()->json(['message' => 'Séance supprimée avec succès.']);
    }

    public function parProgramme(\App\Models\Programme $programme)
    {
        $this->authorize('viewAny', Seance::class);

        $seances = $programme->seances()
            ->withCount([
                'presences as presents_count' => fn ($q) => $q->where('statut', 'present'),
                'presences as absents_count' => fn ($q) => $q->where('statut', 'absent'),
                'presences as excuses_count' => fn ($q) => $q->where('statut', 'excuse'),
            ])
            ->orderByDesc('date_seance')
            ->paginate(15);

        return SeanceResource::collection($seances);
    }
}
