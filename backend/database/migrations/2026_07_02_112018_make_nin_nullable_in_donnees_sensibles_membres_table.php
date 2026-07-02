<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donnees_sensibles_membres', function (Blueprint $table) {
            $table->text('nin')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('donnees_sensibles_membres', function (Blueprint $table) {
            $table->text('nin')->nullable(false)->change();
        });
    }
};
