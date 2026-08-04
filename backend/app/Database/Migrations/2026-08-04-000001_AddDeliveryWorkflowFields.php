<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDeliveryWorkflowFields extends Migration
{
    public function up()
    {
        // A guest party order may not have a permanent customer record.
        $this->forge->modifyColumn('deliveries', [
            'customer_id' => ['type' => 'INT', 'null' => true],
        ]);
        $this->forge->addColumn('deliveries', [
            'party_order_id' => ['type' => 'INT', 'null' => true, 'after' => 'customer_id'],
            'delivered_water_liters' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'default' => 0, 'after' => 'delivered_jars'],
        ]);
        $this->db->query('ALTER TABLE deliveries ADD INDEX idx_delivery_party_order (party_order_id)');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE deliveries DROP INDEX idx_delivery_party_order');
        $this->forge->dropColumn('deliveries', ['party_order_id', 'delivered_water_liters']);
        $this->forge->modifyColumn('deliveries', [
            'customer_id' => ['type' => 'INT', 'null' => false],
        ]);
    }
}
