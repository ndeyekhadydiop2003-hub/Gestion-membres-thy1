<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seance_id')->constrained('seances')->cascadeOnDelete();
            $table->foreignId('membre_id')->constrained('membres')->cascadeOnDelete();
            $table->enum('statut', ['present', 'absent', 'excuse']);
            $table->foreignId('marque_par')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['seance_id', 'membre_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
