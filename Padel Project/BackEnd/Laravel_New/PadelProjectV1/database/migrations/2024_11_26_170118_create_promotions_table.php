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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->string('promo_code');
            $table->integer('usage_limit')->default(1);
            $table->decimal('min_spend')->default(0);
            $table->decimal('discount');
            $table->boolean('for_inactive_users')->default(false);
            $table->boolean('for_new_users')->default(false);
            $table->string('additional_info')->nullable();
            $table->date('start_date')->default(today());
            $table->date('end_date');
            $table->boolean('generic')->default(true);
            $table->boolean('active')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
