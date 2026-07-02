<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgrammeRequest;
use App\Http\Requests\UpdateProgrammeRequest;
use App\Http\Resources\ProgrammeResource;
use App\Models\Programme;
use Illuminate\Support\Facades\Auth;

class ProgrammeController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Programme::class);

        $programmes = Programme::withCount('seances')
            ->orderBy('nom')
            ->get()
            ->map(function ($programme) {
                $programme->taux_presence = $this->calculerTauxPresence($programme);
                return $programme;
            });

        return ProgrammeResource::collection($programmes);
    }

    public function store(StoreProgrammeRequest $request)
    {
        $donnees = $request->validated();
        $donnees['cree_par'] = Auth::id();

        $programme = Programme::create($donnees);

        return new ProgrammeResource($programme->loadCount('seances'));
    }

    public function show(Programme $programme)
    {
        $this->authorize('view', $programme);

        $programme->loadCount('seances');
        $programme->taux_presence = $this->calculerTauxPresence($programme);
        $programme->load(['seances' => function ($query) {
            $query->withCount([
                'presences as presents_count' => fn ($q) => $q->where('statut', 'present'),
                'presences as absents_count' => fn ($q) => $q->where('statut', 'absent'),
                'presences as excuses_count' => fn ($q) => $q->where('statut', 'excuse'),
            ])->orderByDesc('date_seance');
        }]);

        return new ProgrammeResource($programme);
    }

    public function update(UpdateProgrammeRequest $request, Programme $programme)
    {
        $programme->update($request->validated());

        return new ProgrammeResource($programme->loadCount('seances'));
    }

    public function destroy(Programme $programme)
    {
        $this->authorize('delete', $programme);

        if ($programme->seances()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un programme qui a déjà des séances enregistrées.',
            ], 422);
        }

        $programme->delete();

        return response()->json(['message' => 'Programme supprimé avec succès.']);
    }

    private function calculerTauxPresence(Programme $programme): int
    {
        $total = \App\Models\Presence::whereHas('seance', fn ($q) => $q->where('programme_id', $programme->id))->count();

        if ($total === 0) {
            return 0;
        }

        $presents = \App\Models\Presence::whereHas('seance', fn ($q) => $q->where('programme_id', $programme->id))
            ->where('statut', 'present')
            ->count();

        return (int) round(($presents / $total) * 100);
    }
}
