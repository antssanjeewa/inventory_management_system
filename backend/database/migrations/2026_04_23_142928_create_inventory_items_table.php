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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->string('code')->unique();
            $table->integer('quantity')->default(0);
            $table->string('serial_number')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('place_id')->constrained()->onDelete('restrict');
            $table->enum('status', ['In-Store', 'Borrowed', 'Damaged', 'Missing'])->default('In-Store');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
