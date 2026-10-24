<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class CustomerController extends BaseController
{
    public function index()
    {
        $params = $this->request->getGet();
        $search = trim($params['search'] ?? '');
        $customerType = trim($params['customer_type'] ?? '');
        $status = trim($params['customer_status'] ?? '');
        // manager_id removed from customer filters — customers table doesn't hold manager reference
        $pending = ($params['pending'] ?? '') === '1';
        $pendingJars = ($params['pending_jars'] ?? '') === '1';
        $depositMin = isset($params['deposit_min']) ? (float)$params['deposit_min'] : null;
        $page = max(1, (int)($params['page'] ?? 1));
        $pageSize = max(1, min(200, (int)($params['page_size'] ?? 50)));

        $db = db_connect();
        $builder = $db->table('customers')
            ->select('id, customer_code, name, mobile, address, customer_type, rate_per_jar, security_deposit, pending_amount, outside_jars, customer_status, created_at')
            ->orderBy('name');

        if ($search !== '') {
            $builder->groupStart()->like('name', $search)->orLike('mobile', $search)->groupEnd();
        }

        if (in_array($customerType, ['daily', 'monthly'], true)) {
            $builder->where('customer_type', $customerType);
        }

        if ($status !== '') {
            $builder->where('customer_status', $status);
        }

        // manager filter removed — customers table does not have manager_id column
        // If in future customers get assigned to managers, reintroduce a manager filter here.

        if ($pending) {
            $builder->where('pending_amount >', 0);
        }

        if ($pendingJars) {
            $builder->where('outside_jars >', 0);
        }

        if ($depositMin !== null) {
            $builder->where('security_deposit >=', $depositMin);
        }

        $total = $builder->countAllResults(false);
        $builder->limit($pageSize, ($page - 1) * $pageSize);
        $data = $builder->get()->getResultArray();

        return $this->response->setJSON(['status' => true, 'data' => $data, 'page' => $page, 'page_size' => $pageSize, 'total' => $total]);
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

    public function statement($id)
    {
        $id = (int)$id;
        $month = $this->request->getGet('month') ?: date('Y-m');
        $start = $month . '-01';
        $end = date('Y-m-d', strtotime($start . ' +1 month'));

        $db = db_connect();
        $customer = $db->table('customers')->where('id', $id)->get()->getRowArray();
        if (!$customer) return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Customer not found.']);

        // deliveries for month
        // compute opening balance before the month: debits (deliveries) minus credits (payments) before start
        $debitsBefore = (float)($db->table('deliveries')->selectSum('amount')->where('customer_id', $id)->where('delivery_date <', $start)->get()->getRowArray()['amount'] ?? 0);
        $creditsBefore = (float)($db->table('payments')->selectSum('amount')->where('customer_id', $id)->where('payment_date <', $start)->get()->getRowArray()['amount'] ?? 0);
        $openingBalance = $debitsBefore - $creditsBefore;

        $deliveries = $db->table('deliveries')->select("id, delivery_date AS date, amount, received_amount, delivered_jars, returned_jars, remarks")
            ->where('customer_id', $id)->where('delivery_date >=', $start)->where('delivery_date <', $end)->orderBy('delivery_date', 'ASC')->get()->getResultArray();

        // payments for month
        $payments = $db->table('payments')->select("id, payment_date AS date, amount, payment_mode, remarks")
            ->where('customer_id', $id)->where('payment_date >=', $start)->where('payment_date <', $end)->orderBy('payment_date', 'ASC')->get()->getResultArray();

        $entries = [];
        foreach ($deliveries as $d) {
            $entries[] = [
                'date' => $d['date'],
                'type' => 'delivery',
                'description' => 'Delivery',
                'debit' => (float)$d['amount'],
                'credit' => 0.0,
                'meta' => ['delivered_jars' => (int)$d['delivered_jars'], 'returned_jars' => (int)$d['returned_jars'], 'received_amount' => (float)$d['received_amount'], 'remarks' => $d['remarks']]
            ];
        }
        foreach ($payments as $p) {
            $entries[] = [
                'date' => $p['date'],
                'type' => 'payment',
                'description' => ($p['remarks'] ?? '') === 'Pending settlement' ? 'Pending amount cleared' : 'Payment',
                'debit' => 0.0,
                'credit' => (float)$p['amount'],
                'meta' => ['mode' => $p['payment_mode'] ?? ($p['payment_mode'] ?? ''), 'remarks' => $p['remarks']]
            ];
        }

        usort($entries, static function ($a, $b) {
            if ($a['date'] === $b['date']) return $a['type'] <=> $b['type'];
            return $a['date'] <=> $b['date'];
        });

        $running = $openingBalance;
        $entriesWithBalance = [];
        foreach ($entries as $e) {
            $running += ($e['debit'] - $e['credit']);
            $e['balance'] = $running;
            $entriesWithBalance[] = $e;
        }

        $totalDebit = array_sum(array_map(static fn($e) => $e['debit'], $entriesWithBalance));
        $totalCredit = array_sum(array_map(static fn($e) => $e['credit'], $entriesWithBalance));

        return $this->response->setJSON([
            'status' => true,
            'data' => [
                'customer' => $customer,
                'month' => $month,
                'start' => $start,
                'end' => $end,
                'opening_balance' => $openingBalance,
                'entries' => $entriesWithBalance,
                'totals' => ['debit' => $totalDebit, 'credit' => $totalCredit, 'net' => $totalCredit - $totalDebit]
            ]
        ]);
    }
}
