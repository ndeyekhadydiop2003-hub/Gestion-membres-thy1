<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            // Utilisés uniquement pour les participants "autres" (hors base des membres).
            // Pour un membre enregistré, la section est calculée depuis sa date de naissance
            // et le sexe vient directement de sa fiche membre.
            $table->string('section')->nullable()->after('nom_autre'); // '1', '2' ou '3'
            $table->string('sexe')->nullable()->after('section'); // 'M' ou 'F'
        });
    }

    public function down(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            $table->dropColumn(['section', 'sexe']);
        });
    }
};
