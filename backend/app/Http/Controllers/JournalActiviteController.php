<?php

namespace App\Http\Controllers;

use App\Models\JournalActivite;

class JournalActiviteController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', \App\Models\User::class); // réservé au Super Admin

        $logs = JournalActivite::with('utilisateur')
            ->orderByDesc('created_at')
            ->paginate(20);

        $donnees = $logs->through(fn ($log) => [
            'id' => $log->id,
            'utilisateur' => $log->utilisateur?->nom ?? 'Système',
            'action' => $log->action,
            'ip' => $log->ip_address,
            'cree_le' => $log->created_at->format('d/m/Y H:i'),
        ]);

        return response()->json($donnees);
    }
}
