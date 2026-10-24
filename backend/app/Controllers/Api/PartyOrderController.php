<?php
namespace App\Controllers\Api;
use App\Controllers\BaseController;
use App\Models\PartyOrderModel;
class PartyOrderController extends BaseController
{
    public function index() { return $this->response->setJSON(['status' => true, 'data' => (new PartyOrderModel())->orderBy('event_date', 'ASC')->findAll()]); }
    public function show($id)
    {
        $db = db_connect();
        $model = new PartyOrderModel();
        $order = $model->find($id);
        if (!$order) {
            return $this->response->setStatusCode(404)->setJSON(['status' => false, 'message' => 'Order not found']);
        }

        // Fetch deliveries for this party order with manager name
        $deliveries = $db->table('deliveries')
            ->select('deliveries.id, deliveries.delivery_no, deliveries.delivery_date, deliveries.delivered_jars, deliveries.returned_jars, deliveries.amount, deliveries.received_amount, deliveries.remarks, users.id AS manager_id, users.name AS manager_name')
            ->join('users', 'users.id = deliveries.manager_id', 'left')
            ->where('party_order_id', $id)
            ->orderBy('delivery_date', 'ASC')
            ->get()->getResultArray();

        // Fetch payments for this party order with manager name
        $payments = $db->table('payments')
            ->select('payments.id, payments.payment_date, payments.amount, payments.payment_mode, payments.remarks, payments.received_by, users.name AS manager_name')
            ->join('users', 'users.id = payments.received_by', 'left')
            ->where('party_order_id', $id)
            ->orderBy('payment_date', 'ASC')
            ->get()->getResultArray();

        // Fetch return history (may not have manager info)
        $returns = [];
        if ($db->tableExists('party_return_history')) {
            $returns = $db->table('party_return_history')
                ->select('id, return_date, returned_jars, remarks')
                ->where('party_order_id', $id)
                ->orderBy('return_date', 'ASC')
                ->get()->getResultArray();
        }

        $receivedTotal = array_sum(array_map(static fn($p) => (float)$p['amount'], $payments));

        return $this->response->setJSON(['status' => true, 'data' => [
            'order' => $order,
            'deliveries' => $deliveries,
            'payments' => $payments,
            'returns' => $returns,
            'received_total' => $receivedTotal,
        ]]);
    }
    public function store()
    {
        $data = $this->request->getJSON(true) ?: [];
        foreach (['customer_name', 'mobile', 'event_name', 'event_date'] as $field) if (trim((string)($data[$field] ?? '')) === '') return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required.']);
        $jars = max(0, (int)($data['total_jars'] ?? 0)); $water = max(0, (float)($data['water_liters'] ?? 0));
        if (!$jars && !$water) return $this->response->setStatusCode(422)->setJSON(['status' => false, 'message' => 'Add jar or water quantity.']);
        $rate = max(0, (float)($data['rate'] ?? 0)); $total = max(0, (float)($data['total_amount'] ?? ($jars * $rate))); $advance = min($total, max(0, (float)($data['advance'] ?? 0)));
        $customerId = (int) ($data['customer_id'] ?? 0);
        $managerId = (int) ($data['manager_id'] ?? 0);
        if ($managerId > 0 && !db_connect()->table('users')->where('id', $managerId)->countAllResults()) {
            $managerId = 0;
        }
        $model = new PartyOrderModel();
        $model->insert(['order_no' => 'PO-' . date('YmdHis'), 'customer_id' => $customerId > 0 ? $customerId : null, 'customer_name' => trim($data['customer_name']), 'mobile' => trim($data['mobile']), 'address' => $data['address'] ?? '', 'event_name' => trim($data['event_name']), 'event_type' => $data['event_type'] ?? '', 'event_date' => $data['event_date'], 'event_time' => $data['event_time'] ?? null, 'delivery_address' => $data['delivery_address'] ?? '', 'manager_id' => $managerId > 0 ? $managerId : null, 'total_jars' => $jars, 'water_liters' => $water, 'rate' => $rate, 'total_amount' => $total, 'advance' => $advance, 'received_amount' => $advance, 'pending_amount' => $total - $advance, 'pending_return_jars' => 0, 'status' => 'upcoming', 'remarks' => $data['remarks'] ?? '']);
        return $this->response->setStatusCode(201)->setJSON(['status' => true, 'party_order_id' => $model->getInsertID(), 'message' => 'Party order created.']);
    }
}
