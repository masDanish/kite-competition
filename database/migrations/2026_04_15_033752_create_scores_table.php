<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('jury_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('criteria_id')->constrained('scoring_criteria')->onDelete('cascade');
            $table->decimal('score', 8, 2);
            $table->text('comment')->nullable();
            $table->timestamps();
            $table->unique(['submission_id', 'jury_id', 'criteria_id']);
        });
    }

    public function down(): void { Schema::dropIfExists('scores'); }
};