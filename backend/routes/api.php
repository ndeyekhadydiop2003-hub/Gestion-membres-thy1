<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\MessagerieController;
use App\Http\Controllers\ImportExportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;



Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('moi', [AuthController::class, 'utilisateurConnecte']);

        Route::apiResource('membres', MembreController::class);
        Route::apiResource('groupes', GroupeController::class);
        Route::get('groupes/{groupe}/membres', [GroupeController::class, 'membres']);
        Route::post('groupes/{groupe}/membres', [GroupeController::class, 'ajouterMembre']);
        Route::apiResource('programmes', ProgrammeController::class);
        Route::apiResource('seances', SeanceController::class);

        Route::prefix('seances/{seance}')->group(function () {
            Route::get('presences', [PresenceController::class, 'index']);
            Route::post('presences', [PresenceController::class, 'marquer']);
            Route::post('presences/{membre}', [PresenceController::class, 'marquerUnique']);
        });

        Route::prefix('messagerie')->group(function () {
            Route::get('destinataires', [MessagerieController::class, 'destinataires']);
            Route::get('campagnes', [MessagerieController::class, 'index']);
            Route::post('campagnes', [MessagerieController::class, 'store']);
            Route::post('campagnes/brouillon', [MessagerieController::class, 'brouillon']);
            Route::get('campagnes/{message}', [MessagerieController::class, 'show']);
            Route::delete('campagnes/{message}', [MessagerieController::class, 'destroy']);
        });

        Route::post('import-export/importer', [ImportExportController::class, 'importer']);
        Route::post('import-export/exporter', [ImportExportController::class, 'exporter']);
        Route::get('import-export/historique', [ImportExportController::class, 'historique']);
        Route::get('import-export/modele', [ImportExportController::class, 'telechargerModele']);

        Route::get('dashboard/statistiques', [DashboardController::class, 'statistiques']);
      });


});
