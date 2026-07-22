<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // On reconstruit la table pour :
        // - rendre membre_id nullable (permet d'ajouter des participants hors base = "autres")
        // - ajouter nom_autre (nom saisi manuellement pour ces participants)
        // - convertir "excuse" restant en "absent" (le statut Excusé est supprimé)
        Schema::create('presences_temp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->cascadeOnDelete();
            $table->foreignId('membre_id')->nullable()->constrained('membres')->nullOnDelete();
            $table->string('nom_autre')->nullable();
            $table->string('statut'); // 'present' ou 'absent'
            $table->foreignId('marque_par')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['seance_id', 'membre_id']);
        });

        DB::statement("
            INSERT INTO presences_temp (id, seance_id, membre_id, statut, marque_par, created_at, updated_at)
            SELECT id, seance_id, membre_id,
                   CASE WHEN statut = 'excuse' THEN 'absent' ELSE statut END,
                   marque_par, created_at, updated_at
            FROM presences
        ");

        Schema::drop('presences');
        Schema::rename('presences_temp', 'presences');
    }

    public function down(): void
    {
        Schema::create('presences_temp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->cascadeOnDelete();
            $table->foreignId('membre_id')->constrained('membres')->cascadeOnDelete();
            $table->enum('statut', ['present', 'absent', 'excuse']);
            $table->foreignId('marque_par')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['seance_id', 'membre_id']);
        });

        DB::statement("
            INSERT INTO presences_temp (id, seance_id, membre_id, statut, marque_par, created_at, updated_at)
            SELECT id, seance_id, membre_id, statut, marque_par, created_at, updated_at
            FROM presences
            WHERE membre_id IS NOT NULL
        ");

        Schema::drop('presences');
        Schema::rename('presences_temp', 'presences');
    }
};
