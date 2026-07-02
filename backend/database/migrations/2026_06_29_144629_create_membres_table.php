<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->enum('sexe', ['M', 'F']);
            $table->date('date_naissance')->nullable();
            $table->string('niveau')->nullable();
            $table->string('profession')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->date('date_adhesion');
            $table->string('photo_chemin')->nullable();

            $table->foreignId('groupe_id')->nullable()->constrained('groupes')->nullOnDelete();
            $table->foreignId('cree_par')->constrained('users')->cascadeOnDelete();

            $table->softDeletes(); // gère supprime_le automatiquement
            $table->timestamps();

            $table->index(['nom', 'prenom']);
            $table->index('telephone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membres');
    }
};
