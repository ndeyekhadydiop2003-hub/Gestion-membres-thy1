<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('programme_id')->constrained('programmes')->cascadeOnDelete();
            $table->date('date_seance');
            $table->time('heure_debut')->nullable();
            $table->string('lieu')->nullable();
            $table->enum('statut', ['planifiee', 'terminee', 'annulee'])->default('planifiee');
            $table->foreignId('cree_par')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index('date_seance');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};
