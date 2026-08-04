<?php
namespace App\Database\Migrations;
use CodeIgniter\Database\Migration;
class MakeDeliveryManagerOptional extends Migration
{
    public function up() { $this->forge->modifyColumn('deliveries', ['manager_id' => ['type' => 'INT', 'null' => true]]); }
    public function down() { $this->forge->modifyColumn('deliveries', ['manager_id' => ['type' => 'INT', 'null' => false]]); }
}
