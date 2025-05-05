<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('swaps', function (Blueprint $table) {
            $table->uuid('uid')->unique()->after('id');
        });
    }

    public function down()
    {
        Schema::table('swaps', function (Blueprint $table) {
            $table->dropColumn('uid');
        });
    }
}; 