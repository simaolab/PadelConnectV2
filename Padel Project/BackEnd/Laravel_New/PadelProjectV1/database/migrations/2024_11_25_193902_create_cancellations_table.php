<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id');
            $table->string('reason')->nullable();
            $table->decimal('total_refunded');
            $table->string('status');
            $table->date('cancellation_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellations');
    }
};
