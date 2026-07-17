<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiant ou mot de passe incorrect.'],
            ]);
        }

        $user->update(['derniere_connexion_le' => now()]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function utilisateurConnecte(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifierTokenActivation($token)
{
    $user = User::where('token_activation', $token)->first();

    if (!$user || $user->token_expire_le < now()) {
        return response()->json(['message' => 'Ce lien est invalide ou a expiré.'], 404);
    }

    return response()->json([
        'nom' => $user->nom,
        'prenom' => $user->prenom,
        'email' => $user->email,
    ]);
}

public function activerCompte(Request $request, $token)
    {
        $user = User::where('token_activation', $token)->first();

        if (!$user || $user->token_expire_le < now()) {
            return response()->json(['message' => 'Ce lien est invalide ou a expiré.'], 404);
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => $request->password, // casté en 'hashed' automatiquement
            'token_activation' => null,
            'token_expire_le' => null,
        ]);

        return response()->json(['message' => 'Compte activé avec succès.']);
    }
}
