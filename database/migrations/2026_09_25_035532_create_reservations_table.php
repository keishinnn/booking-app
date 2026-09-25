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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->uuid('table_id');
            $table->string('guest_name');
            $table->string('email');
            $table->string('phone');
            $table->unsignedTinyInteger('party_size');
            $table->date('reserved_on');
            $table->time('starts_at');
            $table->string('status')->default('confirmed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['table_id', 'reserved_on', 'status']);
            $table->index('reserved_on');
            $table->index('status');
            $table->index('party_size');
            $table->index('guest_name');
            $table->index('email');
            $table->index('phone');
            $table->index('created_at');

            $table->foreign('table_id')
                ->references('id')
                ->on('tables')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
