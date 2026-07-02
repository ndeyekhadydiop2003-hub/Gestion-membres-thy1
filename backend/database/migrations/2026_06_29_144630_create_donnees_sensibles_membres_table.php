<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donnees_sensibles_membres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('membre_id')->unique()->constrained('membres')->cascadeOnDelete();
            $table->text('nin'); // chiffré via cast sur le modèle
            $table->text('numero_electeur')->nullable(); // chiffré via cast sur le modèle
            $table->enum('groupe_sanguin', ['A+','A-','B+','B-','AB+','AB-','O+','O-'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donnees_sensibles_membres');
    }
};
