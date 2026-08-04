<?php
namespace App\Database\Migrations;
use CodeIgniter\Database\Migration;
class AddPartyOrderDetailFields extends Migration
{
    public function up()
    {
        $this->forge->addColumn('party_orders', [
            'event_type' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => true, 'after' => 'event_name'],
            'event_time' => ['type' => 'TIME', 'null' => true, 'after' => 'event_date'],
            'delivery_address' => ['type' => 'TEXT', 'null' => true, 'after' => 'event_time'],
            'water_liters' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'default' => 0, 'after' => 'total_jars'],
        ]);
    }
    public function down() { $this->forge->dropColumn('party_orders', ['event_type', 'event_time', 'delivery_address', 'water_liters']); }
}
