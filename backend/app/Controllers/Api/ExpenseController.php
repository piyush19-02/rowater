<?php
namespace App\Controllers\Api;
use App\Controllers\BaseController;
class ExpenseController extends BaseController
{
    public function index()
    {
        $params = $this->request->getGet();
        $categoryId = (int)($params['category_id'] ?? 0);
        $managerId = (int)($params['manager_id'] ?? 0);
        $all = ($params['all'] ?? '') === '1';
        $page = max(1, (int)($params['page'] ?? 1));
        $pageSize = max(1, min(100, (int)($params['page_size'] ?? 20)));

        $db = db_connect();
        $builder = $db->table('expenses')
            ->select('expenses.id, expenses.category_id, expense_categories.category_name, expenses.expense_date, expenses.amount, expenses.description, expenses.added_by, users.name as manager_name')
            ->join('expense_categories', 'expense_categories.id = expenses.category_id', 'left')
            ->join('users', 'users.id = expenses.added_by', 'left')
            ->orderBy('expenses.expense_date', 'DESC')
            ->orderBy('expenses.id', 'DESC');

        if ($categoryId > 0) {
            $builder->where('expenses.category_id', $categoryId);
        }

        if ($managerId > 0) {
            $builder->where('expenses.added_by', $managerId);
        }

        $total = $builder->countAllResults(false);

        if (!$all) {
            $builder->limit($pageSize, ($page - 1) * $pageSize);
        }

        $data = $builder->get()->getResultArray();

        return $this->response->setJSON([
            'status' => true,
            'data' => $data,
            'page' => $page,
            'page_size' => $pageSize,
            'total' => $total,
        ]);
    }

    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        if (!(int)($data['category_id'] ?? 0) || (float)($data['amount'] ?? 0) <= 0 || empty($data['expense_date'])) {
            return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Category, amount and date are required.']);
        }

        // Accept either added_by (admin) or manager_id (from manager UI) and normalize to $addedBy
        $addedBy = (int)($data['added_by'] ?? ($data['manager_id'] ?? 0));

        // Ensure added_by refers to an existing user (do not allow NULL/invalid values because of FK constraint)
        $db = db_connect();
        if ($addedBy < 1 || $db->table('users')->where('id', $addedBy)->countAllResults() === 0) {
            return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'added_by (or manager_id) must be a valid user id (manager or admin).']);
        }

        $id = $db->table('expenses')->insert([
            'category_id' => (int)$data['category_id'],
            'amount' => (float)$data['amount'],
            'expense_date' => $data['expense_date'],
            'description' => $data['description'] ?? '',
            'added_by' => $addedBy,
        ], true);

        return $this->response->setStatusCode(201)->setJSON(['status' => true, 'id' => $id]);
    }
}
