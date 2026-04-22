<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Admin Sistem',
            'email'    => 'admin@kite.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'phone'    => '08111000001',
        ]);

        // Juri
        $juries = [
            ['name' => 'Dr. Budi Santoso',  'email' => 'juri1@kite.test'],
            ['name' => 'Ir. Siti Rahayu',   'email' => 'juri2@kite.test'],
            ['name' => 'Ahmad Fauzi, M.Sn', 'email' => 'juri3@kite.test'],
            ['name' => 'Dian Purnama',      'email' => 'juri4@kite.test'],
            ['name' => 'Rudi Hartono',      'email' => 'juri5@kite.test'],
        ];

        foreach ($juries as $jury) {
            User::create([
                ...$jury,
                'password' => Hash::make('password'),
                'role'     => 'jury',
            ]);
        }

        // Peserta
        $participants = [
            ['name' => 'Andi Pratama',   'email' => 'peserta1@kite.test'],
            ['name' => 'Dewi Lestari',   'email' => 'peserta2@kite.test'],
            ['name' => 'Rizky Fauzan',   'email' => 'peserta3@kite.test'],
            ['name' => 'Sari Wahyuni',   'email' => 'peserta4@kite.test'],
            ['name' => 'Bagas Kurniawan','email' => 'peserta5@kite.test'],
            ['name' => 'Fajar Nugroho',  'email' => 'peserta6@kite.test'],
            ['name' => 'Nina Oktaviani', 'email' => 'peserta7@kite.test'],
            ['name' => 'Putra Mahendra', 'email' => 'peserta8@kite.test'],
            ['name' => 'Yuni Kartika',   'email' => 'peserta9@kite.test'],
            ['name' => 'Rama Saputra',   'email' => 'peserta10@kite.test'],
        ];

        foreach ($participants as $p) {
            User::create([
                ...$p,
                'password' => Hash::make('password'),
                'role'     => 'user',
            ]);
        }
    }
}