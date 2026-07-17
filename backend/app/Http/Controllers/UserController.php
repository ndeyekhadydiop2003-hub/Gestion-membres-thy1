<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::orderByDesc('created_at')->get();

        return UserResource::collection($users);
    }

   public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $donnees = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,super_admin',
        ]);

        $token = Str::random(60);

        $user = User::create([
            'nom' => $donnees['nom'],
            'prenom' => $donnees['prenom'],
            'email' => $donnees['email'],
            'role' => $donnees['role'],
            'password' => Hash::make(Str::random(40)), // inutilisable, remplacé à l'activation
            'token_activation' => $token,
            'token_expire_le' => now()->addHours(48),
        ]);

        $lienActivation = config('app.frontend_url') . '/?activation=' . $token;

        // TODO (mail mis de côté) : envoyer $lienActivation par email à $user->email
        // En attendant, on le renvoie directement pour transmission manuelle par le Super Admin.

        return response()->json([
            'user' => new UserResource($user),
            'lien_activation' => $lienActivation,
        ], 201);
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        if ($user->estSuperAdmin() && User::where('role', 'super_admin')->count() <= 1) {
            return response()->json([
                'message' => 'Impossible de supprimer le dernier Super Admin.',
            ], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Compte supprimé avec succès.']);
    }
}
