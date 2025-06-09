<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('swap_deals', function (Blueprint $table) {
            $table->boolean('initiator_accepted')->default(false);
            $table->boolean('acceptor_accepted')->default(false);
        });
    }

    public function down()
    {
        Schema::table('swap_deals', function (Blueprint $table) {
            $table->dropColumn(['initiator_accepted', 'acceptor_accepted']);
        });
    }
}; 