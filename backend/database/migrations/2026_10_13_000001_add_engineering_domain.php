<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role VARCHAR(30) NOT NULL DEFAULT 'client'");
        }
        if (DB::getDriverName() === 'sqlite') {
            DB::statement("CREATE INDEX IF NOT EXISTS users_role_index ON users(role)");
        }

        Schema::table('service_requests', function (Blueprint $table) {
            $table->string('building_type')->nullable()->after('description');
            $table->string('location')->nullable()->after('building_type');
            $table->decimal('approximate_surface', 12, 2)->nullable()->after('location');
            $table->unsignedInteger('levels_count')->nullable()->after('approximate_surface');
            $table->enum('intervention_type', ['new_build', 'extension', 'rehabilitation'])->nullable()->after('levels_count');
            $table->string('requested_mission')->nullable()->after('intervention_type');
            $table->text('available_documents')->nullable()->after('requested_mission');
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_request_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('responsible_engineer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reference')->unique();
            $table->string('name');
            $table->enum('technical_stage', [
                'documents_to_complete',
                'study_in_progress',
                'internal_review',
                'documents_transmitted',
                'observations_to_process',
                'mission_closed',
            ])->default('documents_to_complete');
            $table->unsignedTinyInteger('technical_progress')->default(0);
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('project_stage_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_stage')->nullable();
            $table->string('to_stage');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('project_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category');
            $table->string('original_name');
            $table->string('path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->unsignedInteger('version')->default(1);
            $table->enum('state', ['draft', 'to_review', 'validated'])->default('draft');
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->index(['project_id', 'category']);
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('project_documents');
        Schema::dropIfExists('project_stage_histories');
        Schema::dropIfExists('projects');
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn([
                'building_type', 'location', 'approximate_surface', 'levels_count',
                'intervention_type', 'requested_mission', 'available_documents',
            ]);
        });
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('client', 'admin', 'accountant') NOT NULL DEFAULT 'client'");
        }
    }
};
