<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('rules')->nullable();
            $table->string('poster')->nullable();
            $table->string('location')->nullable();
            $table->date('registration_start');
            $table->date('registration_end');
            $table->date('event_start');
            $table->date('event_end');
            $table->unsignedInteger('max_participants')->nullable();
            $table->enum('status', ['draft','open','closed','ongoing','finished'])->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('events'); }
};