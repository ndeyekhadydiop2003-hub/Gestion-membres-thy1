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

    /**
     * Met à jour les informations du compte connecté (nom, prénom, email).
     */
    public function mettreAJourProfil(Request $request)
    {
        $user = $request->user();

        $donnees = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($donnees);

        return response()->json($user->fresh());
    }

    /**
     * Change le mot de passe du compte connecté après vérification de l'ancien.
     */
    public function changerMotDePasse(Request $request)
    {
        $user = $request->user();

        $donnees = $request->validate([
            'mot_de_passe_actuel' => 'required|string',
            'nouveau_mot_de_passe' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($donnees['mot_de_passe_actuel'], $user->password)) {
            throw ValidationException::withMessages([
                'mot_de_passe_actuel' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update(['password' => $donnees['nouveau_mot_de_passe']]);

        // Par sécurité, on déconnecte toutes les autres sessions actives
        // (on garde uniquement le jeton utilisé pour cette requête).
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }

    /**
     * Déconnecte tous les autres appareils/sessions connectés à ce compte.
     */
    public function deconnecterAutresAppareils(Request $request)
    {
        $user = $request->user();

        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json(['message' => 'Les autres appareils ont été déconnectés.']);
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
