<?php

namespace App\Models;

use CodeIgniter\Model;

class DeliveryModel extends Model
{
    protected $table = 'deliveries';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useTimestamps = true;
    protected $allowedFields = [
        'delivery_no', 'delivery_date', 'customer_id', 'party_order_id', 'manager_id',
        'delivered_jars', 'delivered_water_liters', 'returned_jars', 'damaged_jars',
        'rate', 'amount', 'received_amount', 'pending_amount', 'payment_mode',
        'delivery_status', 'remarks',
    ];
}
