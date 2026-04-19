<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('scoring_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('max_score')->default(100);
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('scoring_criteria'); }
};