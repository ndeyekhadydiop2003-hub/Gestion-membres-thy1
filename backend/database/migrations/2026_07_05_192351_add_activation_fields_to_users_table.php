<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('prenom')->nullable()->after('nom');
            $table->string('token_activation', 60)->nullable()->unique()->after('password');
            $table->timestamp('token_expire_le')->nullable()->after('token_activation');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['prenom', 'token_activation', 'token_expire_le']);
        });
    }
};
