<?php

namespace App\Models;

use CodeIgniter\Model;

class PartyOrderItemModel extends Model
{
    protected $table = "party_order_items";

    protected $primaryKey = "id";

    protected $returnType = "array";

  protected $allowedFields = [
    "party_order_id",
    "product_id",
    "product_type",
    "qty",
    "quantity",
    "rate",
    "total",
    "amount",
];
}