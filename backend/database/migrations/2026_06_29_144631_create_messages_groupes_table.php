<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages_groupes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expediteur_id')->constrained('users')->cascadeOnDelete();
            $table->string('sujet');
            $table->text('contenu');
            $table->enum('type_cible', ['tous', 'groupe']);
            $table->foreignId('groupe_id')->nullable()->constrained('groupes')->nullOnDelete();
            $table->enum('statut', ['en_attente', 'envoye', 'echoue'])->default('en_attente');
            $table->timestamp('envoye_le')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages_groupes');
    }
};
