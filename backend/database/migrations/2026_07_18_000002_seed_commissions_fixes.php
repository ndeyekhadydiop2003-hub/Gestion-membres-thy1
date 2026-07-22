<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $maintenant = now();

        $commissions = [
            [
                'nom' => 'Points Focaux',
                'description' => null,
                'couleur' => '#2c4f7c',
            ],
            [
                'nom' => 'Commission Logistique',
                'description' => null,
                'couleur' => '#0f766e',
            ],
            [
                'nom' => 'Commission d\'Intelligence et de Perception Spirituelle',
                'description' => null,
                'couleur' => '#7c3aed',
            ],
            [
                'nom' => 'Commission Trésor et Capacitation',
                'description' => null,
                'couleur' => '#b45309',
            ],
            [
                'nom' => 'Commission Administrative',
                'description' => null,
                'couleur' => '#be123c',
            ],
        ];

        foreach ($commissions as $commission) {
            $existe = DB::table('commissions')->where('nom', $commission['nom'])->exists();

            if (!$existe) {
                DB::table('commissions')->insert([
                    ...$commission,
                    'created_at' => $maintenant,
                    'updated_at' => $maintenant,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('commissions')->whereIn('nom', [
            'Points Focaux',
            'Commission Logistique',
            'Commission d\'Intelligence et de Perception Spirituelle',
            'Commission Trésor et Capacitation',
            'Commission Administrative',
        ])->delete();
    }
};
