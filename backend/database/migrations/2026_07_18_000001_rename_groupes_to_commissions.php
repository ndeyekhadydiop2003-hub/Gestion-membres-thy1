<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('groupes', 'commissions');

        Schema::table('membres', function (Blueprint $table) {
            $table->renameColumn('groupe_id', 'commission_id');
        });
    }

    public function down(): void
    {
        Schema::table('membres', function (Blueprint $table) {
            $table->renameColumn('commission_id', 'groupe_id');
        });

        Schema::rename('commissions', 'groupes');
    }
};
