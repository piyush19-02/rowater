<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class CustomerController extends BaseController
{
    public function index()
    {
        $builder = db_connect()->table('customers')->whereIn('customer_type', ['daily', 'monthly'])->where('customer_status', 'active')->orderBy('name');
        return $this->response->setJSON(['status' => true, 'data' => $builder->get()->getResultArray()]);
    }

    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        if (trim($data['name'] ?? '') === '' || trim($data['mobile'] ?? '') === '') return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Name and mobile are required.']);
        $id = db_connect()->table('customers')->insert([
            'customer_code' => 'C-' . date('YmdHis'), 'name' => trim($data['name']), 'mobile' => trim($data['mobile']), 'address' => trim($data['address'] ?? ''),
            'customer_type' => in_array($data['customer_type'] ?? '', ['daily', 'monthly'], true) ? $data['customer_type'] : 'daily', 'rate_per_jar' => (float)($data['rate_per_jar'] ?? 60), 'security_deposit' => max(0, (float)($data['security_deposit'] ?? 0)), 'customer_status' => 'active',
        ], true);
        return $this->response->setStatusCode(201)->setJSON(['status' => true, 'id' => $id]);
    }
}
