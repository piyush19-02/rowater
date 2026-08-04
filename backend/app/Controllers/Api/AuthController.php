<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;

class AuthController extends BaseController
{
    public function login()
    {
        
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->response->setJSON([
                "status" => false,
                "message" => "Invalid Request"
            ]);
        }

        $mobile = trim($data['mobile'] ?? '');
        $password = trim($data['password'] ?? '');
        $role = trim($data['role'] ?? '');

        if ($mobile == "" || $password == "") {

            return $this->response->setJSON([
                "status" => false,
                "message" => "Mobile & Password Required"
            ]);

        }

        $userModel = new UserModel();

        $user = $userModel
            ->where('mobile', $mobile)
            ->where('status', 'active')
            ->first();

        if (!$user) {

            return $this->response->setJSON([
                "status" => false,
                "message" => "User not found"
            ]);

        }

        if ($user['role'] != $role) {

            return $this->response->setJSON([
                "status" => false,
                "message" => "Invalid Role"
            ]);

        }

        if (!password_verify($password, $user['password'])) {

            return $this->response->setJSON([
                "status" => false,
                "message" => "Wrong Password"
            ]);

        }

        unset($user['password']);

        return $this->response->setJSON([
            "status" => true,
            "message" => "Login Successful",
            "user" => $user
        ]);
    }
}