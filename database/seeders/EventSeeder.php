<?php
namespace Database\Seeders;

use App\Models\Event;
use App\Models\Category;
use App\Models\ScoringCriteria;
use App\Models\User;
use App\Models\JuryAssignment;
use App\Models\EventRegistration;
use App\Models\Submission;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Buat Event
        $event = Event::create([
            'title'              => 'Lomba Desain Layangan Nusantara 2025',
            'slug'               => 'lomba-desain-layangan-nusantara-2025',
            'description'        => 'Kompetisi desain layangan tingkat nasional yang mempertemukan ' .
                                    'para desainer terbaik dari seluruh penjuru Indonesia.',
            'rules'              => "1. Peserta wajib WNI\n" .
                                    "2. Desain harus orisinal dan belum pernah dilombakan\n" .
                                    "3. Setiap peserta hanya boleh mengirimkan 1 karya\n" .
                                    "4. Berkas desain dalam format PDF/PNG/JPG (maks. 5MB)\n" .
                                    "5. Keputusan juri bersifat final dan tidak dapat diganggu gugat",
            'location'           => 'Jakarta Convention Center',
            'registration_start' => now()->subDays(10)->toDateString(),
            'registration_end'   => now()->addDays(20)->toDateString(),
            'event_start'        => now()->addDays(25)->toDateString(),
            'event_end'          => now()->addDays(27)->toDateString(),
            'max_participants'   => 100,
            'status'             => 'open',
            'created_by'         => $admin->id,
        ]);

        // Buat Kategori
        $catJunior = Category::create([
            'event_id'        => $event->id,
            'name'            => 'Junior (SMP/SMA)',
            'description'     => 'Untuk peserta berusia 13–18 tahun',
            'max_participants' => 40,
        ]);

        $catSenior = Category::create([
            'event_id'        => $event->id,
            'name'            => 'Senior (Umum)',
            'description'     => 'Untuk peserta berusia 19 tahun ke atas',
            'max_participants' => 60,
        ]);

        // Buat Kriteria Penilaian
        $criteriaData = [
            ['name' => 'Kreativitas & Orisinalitas', 'description' => 'Keunikan dan originalitas desain',
             'max_score' => 100, 'weight' => 1.5],
            ['name' => 'Estetika Visual',            'description' => 'Keindahan tampilan dan komposisi warna',
             'max_score' => 100, 'weight' => 1.0],
            ['name' => 'Teknik & Konstruksi',        'description' => 'Ketepatan teknik dan kelayakan konstruksi',
             'max_score' => 100, 'weight' => 1.2],
            ['name' => 'Nilai Budaya',               'description' => 'Representasi nilai dan budaya lokal',
             'max_score' => 100, 'weight' => 1.0],
            ['name' => 'Kelengkapan Dokumen',        'description' => 'Kelengkapan berkas yang dikirimkan',
             'max_score' => 100, 'weight' => 0.3],
        ];

        $criteria = [];
        foreach ($criteriaData as $c) {
            $criteria[] = ScoringCriteria::create(array_merge($c, ['event_id' => $event->id]));
        }

        // Assign Juri
$juries = User::where('role', 'jury')->get();
$categories = [$catJunior, $catSenior];

foreach ($juries as $jury) {
    foreach ($categories as $category) {
        JuryAssignment::create([
            'user_id'     => $jury->id,
            'event_id'    => $event->id,
            'category_id' => $category->id,
            'is_active'   => true,
            'assigned_at' => now(),
        ]);
    }
}

        // Buat Registrasi Demo
        $participants = User::where('role', 'user')->get();
        $cats = [$catJunior, $catSenior];

        foreach ($participants as $i => $participant) {
            $cat = $cats[$i % 2];

            $reg = EventRegistration::create([
                'user_id'     => $participant->id,
                'event_id'    => $event->id,
                'category_id' => $cat->id,
                'team_name'   => null,
                'status'      => 'approved',
                'approved_at' => now(),
            ]);

            // Buat Submission Demo
            $submission = Submission::create([
                'registration_id' => $reg->id,
                'user_id'         => $participant->id,
                'title'           => "Desain Layangan Tradisional #{$participant->id} - {$participant->name}",
                'description'     => 'Karya desain layangan yang terinspirasi dari motif batik ' .
                                     'dengan sentuhan modern.',
                'status'          => 'approved',
                'submitted_at'    => now()->subDays(rand(1, 5)),
            ]);

            // Buat Score Demo dari setiap juri
            foreach ($juries as $jury) {
                foreach ($criteria as $criterion) {
                    \App\Models\Score::create([
                        'submission_id' => $submission->id,
                        'jury_id'       => $jury->id,
                        'criteria_id'   => $criterion->id,
                        'score'         => rand(60, 100),
                        'comment'       => 'Penilaian demo.',
                    ]);
                }
            }
        }

        $this->command->info('✅ Event, kategori, kriteria, juri, registrasi, dan skor demo berhasil dibuat.');
        $this->command->table(
            ['Email', 'Password', 'Role'],
            [
                ['admin@kite.test',   'password', 'admin'],
                ['juri1@kite.test',   'password', 'jury'],
                ['juri2@kite.test',   'password', 'jury'],
                ['juri3@kite.test',   'password', 'jury'],
                ['peserta1@kite.test','password', 'user'],
                ['peserta2@kite.test','password', 'user'],
                ['peserta3@kite.test','password', 'user'],
            ]
        );
    }
}