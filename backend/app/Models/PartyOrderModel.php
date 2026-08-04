<?php

namespace App\Models;

use CodeIgniter\Model;

class PartyOrderModel extends Model
{
    protected $table = "party_orders";

    protected $primaryKey = "id";

    protected $returnType = "array";

 protected $allowedFields = [
    "customer_id",
    "customer_name",
    "mobile",
    "address",
    "event_type",
    "event_name",
    "event_date",
    "event_time",
    "delivery_address",
    "water_liters",
    "order_no",
    "total_jars",
    "delivered_jars",
    "rate",
    "total_amount",

    "subtotal",
    "discount",
    "advance",
    "received_amount",
    "pending_amount",

    "notes",
    "status",

    "manager_id",
    "returned_jars",
    "pending_return_jars",
    "remarks"
];

    protected $useTimestamps = true;
}
