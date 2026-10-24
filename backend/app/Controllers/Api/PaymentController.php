<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class PaymentController extends BaseController
{
    public function index()
    {
        $db = db_connect();
        $customerId = (int)($this->request->getGet('customer_id') ?? 0);
        $partyOrderId = (int)($this->request->getGet('party_order_id') ?? 0);

        $builder = $db->table('payments')->select('payments.*, users.name AS manager_name')->join('users', 'users.id = payments.received_by', 'left')->orderBy('payment_date', 'ASC');
        if ($customerId) $builder->where('customer_id', $customerId);
        if ($partyOrderId) $builder->where('party_order_id', $partyOrderId);

        $rows = $builder->get()->getResultArray();
        return $this->response->setJSON(['status' => true, 'data' => $rows]);
    }
}
