<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DeliveryModel;

class DeliveryController extends BaseController
{
    public function index()
    {
        $date = $this->request->getGet('date') ?: date('Y-m-d');
        $allDates = $this->request->getGet('all') === '1';
        $type = $this->request->getGet('type');
        $customerId = (int) $this->request->getGet('customer_id');
        $limit = min(20, max(1, (int)($this->request->getGet('limit') ?: 100)));
        $builder = (new DeliveryModel())->select('deliveries.*, customers.name AS customer_name, customers.mobile')
            ->join('customers', 'customers.id = deliveries.customer_id', 'left')
            ->orderBy('id', 'DESC');
        if (!$allDates) $builder->where('delivery_date', $date);
        if ($type === 'party') $builder->where('party_order_id IS NOT NULL', null, false);
        if ($type === 'regular') $builder->where('party_order_id IS NULL', null, false);
        if ($customerId) $builder->where('deliveries.customer_id', $customerId);
        return $this->response->setJSON(['status' => true, 'data' => $builder->limit($limit)->findAll()]);
    }

    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        $customerId = (int) ($data['customer_id'] ?? 0);
        $partyOrderId = (int) ($data['party_order_id'] ?? 0);
        $db = db_connect();
        $managerId = (int) ($data['manager_id'] ?? 0);
        $managerExists = $managerId > 0 && $db->table('users')->where('id', $managerId)->where('status', 'active')->countAllResults() > 0;
        if (!$managerExists) {
            $manager = $db->table('users')->select('id')->where('status', 'active')->orderBy('id')->get(1)->getRowArray();
            $managerId = (int) ($manager['id'] ?? 0);
        }
        if (!$customerId && !$partyOrderId) return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Customer or party order is required.']);

        $jars = max(0, (int) ($data['delivered_jars'] ?? 0));
        $water = max(0, (float) ($data['delivered_water_liters'] ?? 0));
        if (!$jars && !$water) return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Add jar or water delivery quantity.']);
        $amount = max(0, (float) ($data['amount'] ?? 0));
        $received = min($amount, max(0, (float) ($data['received_amount'] ?? 0)));
        $pending = $amount - $received;
        $db->transStart();
        $model = new DeliveryModel();
        $model->insert([
            'delivery_no' => 'DL-' . date('YmdHis') . '-' . random_int(100, 999), 'delivery_date' => $data['delivery_date'] ?? date('Y-m-d'),
            'customer_id' => $customerId ?: null, 'party_order_id' => $partyOrderId ?: null, 'manager_id' => $managerId ?: null,
            'delivered_jars' => $jars, 'delivered_water_liters' => $water, 'returned_jars' => max(0, (int) ($data['returned_jars'] ?? 0)),
            'rate' => (float) ($data['rate'] ?? 0), 'amount' => $amount, 'received_amount' => $received, 'pending_amount' => $pending,
            'payment_mode' => $received ? ($data['payment_mode'] ?? 'cash') : 'credit', 'delivery_status' => 'delivered', 'remarks' => $data['remarks'] ?? null,
        ]);
        $deliveryId = $model->getInsertID();
        if ($customerId) {
            $customer = $db->table('customers')->where('id', $customerId)->get()->getRowArray();
            if (!$customer) { $db->transRollback(); return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Customer not found.']); }
            $returned = max(0, (int) ($data['returned_jars'] ?? 0));
            $db->table('customers')->where('id', $customerId)->update(['pending_amount' => (float)$customer['pending_amount'] + $pending, 'outside_jars' => max(0, (int)$customer['outside_jars'] + $jars - $returned)]);
        }
        if ($partyOrderId) {
            $party = $db->table('party_orders')->where('id', $partyOrderId)->get()->getRowArray();
            if (!$party) { $db->transRollback(); return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Party order not found.']); }
            $returned = max(0, (int) ($data['returned_jars'] ?? 0));
            $deliveredTotal = (int) $party['delivered_jars'] + $jars;
            $returnedTotal = (int) $party['returned_jars'] + $returned;
            $partyPending = max(0, (float) $party['pending_amount'] - $received);
            $pendingJars = max(0, $deliveredTotal - $returnedTotal);
            $db->table('party_orders')->where('id', $partyOrderId)->update([
                'delivered_jars' => $deliveredTotal, 'returned_jars' => $returnedTotal,
                'pending_return_jars' => $pendingJars,
                'received_amount' => (float) $party['received_amount'] + $received,
                'pending_amount' => $partyPending,
                'status' => ($partyPending == 0 && $pendingJars == 0) ? 'completed' : 'delivered',
            ]);
        }
        if ($received > 0) $db->table('payments')->insert(['customer_id' => $customerId ?: null, 'delivery_id' => $deliveryId, 'party_order_id' => $partyOrderId ?: null, 'amount' => $received, 'payment_mode' => $data['payment_mode'] ?? 'cash', 'received_by' => $managerId, 'payment_date' => $data['delivery_date'] ?? date('Y-m-d')]);
        $db->transComplete();
        return $this->response->setJSON(['status' => true, 'message' => 'Delivery saved.', 'delivery_id' => $deliveryId]);
    }

    public function pending()
    {
        $db = db_connect();
        $customers = $db->table('customers')->select('id, name, mobile, address, pending_amount, outside_jars')
            ->groupStart()->where('pending_amount >', 0)->orWhere('outside_jars >', 0)->groupEnd()->get()->getResultArray();
        $parties = $db->table('party_orders')->select('id, customer_name AS name, mobile, address, event_name, pending_amount, pending_return_jars')
            ->where('status', 'delivered')->groupStart()->where('pending_amount >', 0)->orWhere('pending_return_jars >', 0)->groupEnd()->get()->getResultArray();
        $completedParties = $db->table('party_orders')->select('id, customer_name AS name, mobile, address, event_name, pending_amount, pending_return_jars')
            ->where('status', 'completed')->get()->getResultArray();
        return $this->response->setJSON(['status' => true, 'data' => [
            'customers' => [],
            'party_orders' => array_map(static fn($row) => [...$row, 'type' => 'party', 'pending_jars' => (int)$row['pending_return_jars']], $parties),
            'completed_party_orders' => array_map(static fn($row) => [...$row, 'type' => 'party', 'pending_jars' => (int)$row['pending_return_jars']], $completedParties),
        ]]);
    }

    public function settle()
    {
        $data = $this->request->getJSON(true) ?: [];
        $id = (int)($data['id'] ?? 0); $type = $data['type'] ?? ''; $payment = max(0, (float)($data['received_amount'] ?? 0)); $returned = max(0, (int)($data['returned_jars'] ?? 0));
        if (!$id || !in_array($type, ['customer', 'party'], true)) return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Valid pending item is required.']);
        $db = db_connect();
        $receivedBy = $this->validManagerId($db, (int)($data['manager_id'] ?? 0));
        $db->transStart();
        if ($type === 'customer') {
            $row = $db->table('customers')->where('id', $id)->get()->getRowArray();
            if (!$row) return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Customer not found.']);
            $db->table('customers')->where('id', $id)->update(['pending_amount' => max(0, (float)$row['pending_amount'] - $payment), 'outside_jars' => max(0, (int)$row['outside_jars'] - $returned)]);
            if ($payment) $db->table('payments')->insert(['customer_id' => $id, 'amount' => $payment, 'payment_mode' => $data['payment_mode'] ?? 'cash', 'received_by' => $receivedBy, 'payment_date' => date('Y-m-d'), 'remarks' => 'Pending settlement']);
        } else {
            $row = $db->table('party_orders')->where('id', $id)->get()->getRowArray();
            if (!$row) return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Party order not found.']);
            $pendingAfter = max(0, (float)$row['pending_amount'] - $payment);
            $jarsAfter = max(0, (int)$row['pending_return_jars'] - $returned);
            $db->table('party_orders')->where('id', $id)->update(['pending_amount' => $pendingAfter, 'returned_jars' => (int)$row['returned_jars'] + $returned, 'pending_return_jars' => $jarsAfter, 'status' => ($pendingAfter == 0 && $jarsAfter == 0) ? 'completed' : 'delivered']);
            if ($returned) $db->table('party_return_history')->insert(['party_order_id' => $id, 'return_date' => date('Y-m-d'), 'returned_jars' => $returned, 'remarks' => 'Pending jar return']);
            if ($payment) $db->table('payments')->insert(['party_order_id' => $id, 'amount' => $payment, 'payment_mode' => $data['payment_mode'] ?? 'cash', 'received_by' => $receivedBy, 'payment_date' => date('Y-m-d'), 'remarks' => 'Pending settlement']);
        }
        $db->transComplete();
        if ($db->transStatus() === false) return $this->response->setStatusCode(500)->setJSON(['status' => false, 'message' => 'Pending update failed. Please check database foreign-key data.']);
        return $this->response->setJSON(['status' => true, 'message' => 'Pending balance updated.']);
    }

    private function validManagerId($db, int $managerId): ?int
    {
        if ($managerId < 1) return null;
        return $db->table('users')->where('id', $managerId)->countAllResults() > 0 ? $managerId : null;
    }
}
