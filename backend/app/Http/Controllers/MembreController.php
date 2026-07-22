<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMembreRequest;
use App\Http\Requests\UpdateMembreRequest;
use App\Http\Resources\MembreResource;
use App\Models\DonneeSensibleMembre;
use App\Models\Membre;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class MembreController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Membre::class);

        $query = Membre::query()->with('commission');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('commission_id')) {
            $query->where('commission_id', $request->commission_id);
        }

        if ($request->filled('recherche')) {
            $recherche = $request->recherche;
            $query->where(function ($q) use ($recherche) {
                $q->where('nom', 'like', "%{$recherche}%")
                  ->orWhere('prenom', 'like', "%{$recherche}%")
                  ->orWhere('telephone', 'like', "%{$recherche}%")
                  ->orWhere('email', 'like', "%{$recherche}%");
            });
        }

        $tri = $request->get('tri', 'date_adhesion');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($tri, $direction);

        $membres = $query->paginate($request->get('par_page', 8));

        return MembreResource::collection($membres);
    }

    public function store(StoreMembreRequest $request)
    {
        $donnees = $request->validated();

        $membre = DB::transaction(function () use ($donnees) {
            if (isset($donnees['photo']) && $donnees['photo'] instanceof UploadedFile) {
                $donnees['photo_chemin'] = $donnees['photo']->store('membres/photos', 'public');
            }

            $donnees['cree_par'] = Auth::id();

            $nouveauMembre = Membre::create(collect($donnees)->only([
                'nom', 'prenom', 'sexe', 'date_naissance', 'niveau', 'profession',
                'telephone', 'email', 'date_adhesion', 'photo_chemin', 'commission_id',
                'statut', 'cree_par',
            ])->toArray());

            if (isset($donnees['nin']) || isset($donnees['numero_electeur']) || isset($donnees['groupe_sanguin'])) {
                DonneeSensibleMembre::updateOrCreate(
                    ['membre_id' => $nouveauMembre->id],
                    collect($donnees)->only(['nin', 'numero_electeur', 'groupe_sanguin'])->toArray()
                );
            }

            return $nouveauMembre;
        });

        return new MembreResource($membre->fresh(['commission', 'donneesSensibles']));
    }

    public function show(Membre $membre)
    {
        $this->authorize('view', $membre);

        $membre->load('commission');

        $donneeSensible = $membre->donneesSensibles ?? new DonneeSensibleMembre();

        if (Gate::allows('view', $donneeSensible)) {
        $membre->load('donneesSensibles');
}

        return new MembreResource($membre);
    }

    public function update(UpdateMembreRequest $request, Membre $membre)
    {
        $donnees = $request->validated();

        $membre = DB::transaction(function () use ($membre, $donnees) {
            if (isset($donnees['photo']) && $donnees['photo'] instanceof UploadedFile) {
                if ($membre->photo_chemin) {
                    Storage::disk('public')->delete($membre->photo_chemin);
                }
                $donnees['photo_chemin'] = $donnees['photo']->store('membres/photos', 'public');
            }

            $membre->update(collect($donnees)->only([
                'nom', 'prenom', 'sexe', 'date_naissance', 'niveau', 'profession',
                'telephone', 'email', 'date_adhesion', 'photo_chemin', 'commission_id',
                'statut',
            ])->toArray());

            if (isset($donnees['nin']) || isset($donnees['numero_electeur']) || isset($donnees['groupe_sanguin'])) {
                DonneeSensibleMembre::updateOrCreate(
                    ['membre_id' => $membre->id],
                    collect($donnees)->only(['nin', 'numero_electeur', 'groupe_sanguin'])->toArray()
                );
            }

            return $membre;
        });

        return new MembreResource($membre->fresh(['commission', 'donneesSensibles']));
    }

    public function destroy(Membre $membre)
    {
        $this->authorize('delete', $membre);

        $membre->delete(); // soft delete, photo et données sensibles conservées

        return response()->json(['message' => 'Membre supprimé avec succès.']);
    }
}
