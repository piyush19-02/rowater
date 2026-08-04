<?php
namespace App\Controllers\Api;
use App\Controllers\BaseController;
class ManagerController extends BaseController
{
    // Simple manager chooser: intentionally no token/password authentication.
    public function index()
    {
        $data = db_connect()->table('users')->select('id, name, mobile, email, vehicle_no')->where('role', 'manager')->where('status', 'active')->orderBy('name')->get()->getResultArray();
        return $this->response->setJSON(['status' => true, 'data' => $data]);
    }
}
