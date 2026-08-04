<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ExpenseCategoryModel;

class ExpenseCategoryController extends BaseController
{
    public function index()
    {
        return $this->response->setJSON(['status' => true, 'data' => (new ExpenseCategoryModel())->orderBy('category_name')->findAll()]);
    }

    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        $name = trim($data['category_name'] ?? '');
        if ($name === '') return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Category name is required.']);
        $model = new ExpenseCategoryModel();
        if ($model->where('category_name', $name)->first()) return $this->response->setStatusCode(409)->setJSON(['status' => false, 'message' => 'This category already exists.']);
        $model->insert(['category_name' => $name, 'status' => $data['status'] ?? 'active']);
        return $this->response->setStatusCode(201)->setJSON(['status' => true, 'id' => $model->getInsertID()]);
    }
}
