<?php
namespace App\Controllers\Api;
use App\Controllers\BaseController;
class ExpenseController extends BaseController
{
    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        if (!(int)($data['category_id'] ?? 0) || (float)($data['amount'] ?? 0) <= 0 || empty($data['expense_date'])) return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Category, amount and date are required.']);
        $id = db_connect()->table('expenses')->insert(['category_id' => (int)$data['category_id'], 'amount' => (float)$data['amount'], 'expense_date' => $data['expense_date'], 'description' => $data['description'] ?? '', 'added_by' => (int)($data['added_by'] ?? 1)], true);
        return $this->response->setStatusCode(201)->setJSON(['status' => true, 'id' => $id]);
    }
}
