<?php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;

class ManagerController extends BaseController
{
    // Simple manager chooser: intentionally no token/password authentication.
    public function index()
    {
        $data = db_connect()
            ->table('users')
            ->select('id, name, mobile, email, vehicle_no')
            ->where('role', 'manager')
            ->where('status', 'active')
            ->orderBy('name')
            ->get()
            ->getResultArray();

        return $this->response->setJSON(['status' => true, 'data' => $data]);
    }

    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        $name = trim($data['name'] ?? '');
        $mobile = trim($data['mobile'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
        $role = in_array($data['role'] ?? 'manager', ['manager', 'admin'], true) ? $data['role'] : 'manager';

        if ($name === '' || $mobile === '' || $email === '' || $password === '') {
            return $this->response
                ->setStatusCode(422)
                ->setJSON(['status' => false, 'message' => 'Name, mobile, email, and password are required.']);
        }

        $userModel = new UserModel();
        $existing = $userModel->where('email', $email)->first();
        if ($existing) {
            return $this->response
                ->setStatusCode(409)
                ->setJSON(['status' => false, 'message' => 'A user with that email already exists.']);
        }

        $userModel->insert([
            'name' => $name,
            'mobile' => $mobile,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
            'status' => $data['status'] === 'inactive' ? 'inactive' : 'active',
            'vehicle_no' => trim($data['vehicle_no'] ?? ''),
        ]);

        return $this->response->setStatusCode(201)->setJSON(['status' => true]);
    }
}
