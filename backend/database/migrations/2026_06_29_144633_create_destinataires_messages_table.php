<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destinataires_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_groupe_id')->constrained('messages_groupes')->cascadeOnDelete();
            $table->foreignId('membre_id')->constrained('membres')->cascadeOnDelete();
            $table->enum('statut', ['en_attente', 'envoye', 'echoue', 'rebond'])->default('en_attente');
            $table->timestamps();

            $table->unique(['message_groupe_id', 'membre_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destinataires_messages');
    }
};
