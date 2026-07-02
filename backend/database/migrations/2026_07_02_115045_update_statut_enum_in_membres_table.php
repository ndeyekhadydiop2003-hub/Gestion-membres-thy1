<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. On élargit d'abord l'enum pour accepter les deux valeurs en même temps
        DB::statement("ALTER TABLE membres MODIFY COLUMN statut ENUM('actif', 'en_attente', 'inactif', 'suspendu') NOT NULL DEFAULT 'actif'");

        // 2. On convertit les anciennes valeurs
        DB::table('membres')->where('statut', 'en_attente')->update(['statut' => 'inactif']);

        // 3. On restreint l'enum à sa forme finale
        DB::statement("ALTER TABLE membres MODIFY COLUMN statut ENUM('actif', 'inactif', 'suspendu') NOT NULL DEFAULT 'actif'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE membres MODIFY COLUMN statut ENUM('actif', 'en_attente', 'inactif', 'suspendu') NOT NULL DEFAULT 'actif'");
        DB::table('membres')->where('statut', 'inactif')->update(['statut' => 'en_attente']);
        DB::statement("ALTER TABLE membres MODIFY COLUMN statut ENUM('actif', 'en_attente', 'suspendu') NOT NULL DEFAULT 'actif'");
    }
};
