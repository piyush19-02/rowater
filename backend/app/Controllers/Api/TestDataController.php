<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\TestDataCleanup;
use App\Models\UserModel;
use RuntimeException;

class TestDataController extends BaseController
{
    public function clear()
    {
        $data = $this->request->getJSON(true) ?: [];
        $mobile = trim($data['mobile'] ?? '');
        $password = $data['password'] ?? '';

        if ($mobile === '' || $password === '' || ($data['confirmation'] ?? '') !== 'CLEAR-TEST-DATA') {
            return $this->response->setStatusCode(422)->setJSON([
                'status' => false,
                'message' => 'Manager credentials and the exact confirmation phrase are required.',
            ]);
        }

        $manager = (new UserModel())
            ->where('mobile', $mobile)
            ->where('role', 'manager')
            ->where('status', 'active')
            ->first();

        if (! $manager || ! password_verify($password, $manager['password'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => false,
                'message' => 'Manager credentials could not be verified.',
            ]);
        }

        try {
            $preview = (new TestDataCleanup())->clear();
        } catch (RuntimeException $error) {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => false,
                'message' => $error->getMessage(),
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Test data cleared. Users and customer profiles were kept.',
            'cleared_counts' => $preview['counts'],
            'kept_customers' => $preview['customer_count'],
        ]);
    }
}
