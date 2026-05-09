<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            $table->foreignId('pack_id')->nullable()->constrained('packs')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->string('approximate_budget')->nullable();
            $table->date('desired_deadline')->nullable();
            $table->enum('status', [
                'pending',
                'discussion',
                'quote_sent',
                'quote_accepted',
                'quote_refused',
                'invoice_generated',
                'payment_pending',
                'paid',
                'in_progress',
                'completed',
                'cancelled',
            ])->default('pending');
            $table->foreignId('assigned_admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('request_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_request_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->bigInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_files');
        Schema::dropIfExists('service_requests');
    }
};
