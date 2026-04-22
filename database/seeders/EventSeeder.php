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
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        $eventsData = [
            [
                'title' => 'Lomba Desain Layangan Nusantara 2025',
                'location' => 'Jakarta Convention Center',
            ],
            [
                'title' => 'Festival Layangan Kreatif 2025',
                'location' => 'Bandung Creative Hub',
            ],
            [
                'title' => 'Kompetisi Layangan Budaya 2025',
                'location' => 'Taman Budaya Yogyakarta',
            ],
        ];

        foreach ($eventsData as $eventData) {

            $event = Event::create([
                'title'              => $eventData['title'],
                'slug'               => Str::slug($eventData['title']),
                'description'        => 'Kompetisi desain layangan tingkat nasional.',
                'rules'              => "Aturan lomba standar.",
                'location'           => $eventData['location'],
                'registration_start' => now()->subDays(10),
                'registration_end'   => now()->addDays(20),
                'event_start'        => now()->addDays(25),
                'event_end'          => now()->addDays(27),
                'max_participants'   => 100,
                'status'             => 'open',
                'created_by'         => $admin->id,
            ]);

            // kategori
            $catJunior = Category::create([
                'event_id' => $event->id,
                'name' => 'Junior',
                'description' => 'Kategori pelajar',
                'max_participants' => 50,
            ]);

            $catSenior = Category::create([
                'event_id' => $event->id,
                'name' => 'Senior',
                'description' => 'Kategori umum',
                'max_participants' => 50,
            ]);

            // kriteria
            $criteriaData = [
                ['name' => 'Kreativitas', 'max_score' => 100, 'weight' => 1.5],
                ['name' => 'Estetika', 'max_score' => 100, 'weight' => 1.2],
                ['name' => 'Teknik', 'max_score' => 100, 'weight' => 1.0],
                ['name' => 'Budaya', 'max_score' => 100, 'weight' => 1.0],
            ];

            $criteria = [];
            foreach ($criteriaData as $c) {
                $criteria[] = ScoringCriteria::create([
                    ...$c,
                    'event_id' => $event->id
                ]);
            }

            $juries = User::where('role','jury')->get();
            $categories = [$catJunior,$catSenior];

            // assign juri
            foreach ($juries as $jury) {
                foreach ($categories as $category) {
                    JuryAssignment::create([
                        'user_id' => $jury->id,
                        'event_id' => $event->id,
                        'category_id' => $category->id,
                        'is_active' => true,
                        'assigned_at' => now(),
                    ]);
                }
            }

            // peserta
            $participants = User::where('role','user')->get();
            foreach ($participants as $i => $participant) {

                $cat = $categories[$i % 2];

                $reg = EventRegistration::create([
                    'user_id' => $participant->id,
                    'event_id' => $event->id,
                    'category_id' => $cat->id,
                    'status' => 'approved',
                    'approved_at' => now(),
                ]);

                $submission = Submission::create([
                    'registration_id' => $reg->id,
                    'user_id' => $participant->id,
                    'title' => 'Desain Layangan '.$participant->name,
                    'description' => 'Submission demo',
                    'status' => 'approved',
                    'submitted_at' => now(),
                ]);

                foreach ($juries as $jury) {
                    foreach ($criteria as $criterion) {
                        \App\Models\Score::create([
                            'submission_id' => $submission->id,
                            'jury_id' => $jury->id,
                            'criteria_id' => $criterion->id,
                            'score' => rand(70,100),
                            'comment' => 'Penilaian demo',
                        ]);
                    }
                }
            }
        }
    }
}