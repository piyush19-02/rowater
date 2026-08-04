<?php
namespace App\Controllers\Api;
use App\Controllers\BaseController;
class DashboardController extends BaseController
{
    public function monthly()
    {
        $db = db_connect(); $start = date('Y-m-01'); $end = date('Y-m-t');
        $revenue = (float)($db->table('payments')->selectSum('amount')->where('payment_date >=', $start)->where('payment_date <=', $end)->get()->getRowArray()['amount'] ?? 0);
        $customerPending = (float)($db->table('customers')->selectSum('pending_amount')->get()->getRowArray()['pending_amount'] ?? 0);
        $partyPending = (float)($db->table('party_orders')->selectSum('pending_amount')->get()->getRowArray()['pending_amount'] ?? 0);
        $monthlyDue = $db->table('customers')->select('id, name, mobile, address, pending_amount, outside_jars')->where('customer_type', 'monthly')->where('pending_amount >', 0)->orderBy('pending_amount', 'DESC')->get()->getResultArray();
        $expenses = $db->table('expenses')->select('expense_categories.category_name, expenses.expense_date, expenses.amount, expenses.description')->join('expense_categories', 'expense_categories.id = expenses.category_id')->where('expense_date >=', $start)->where('expense_date <=', $end)->orderBy('expense_categories.category_name')->orderBy('expense_date', 'DESC')->get()->getResultArray();
        return $this->response->setJSON(['status' => true, 'data' => ['month' => date('F Y'), 'revenue' => $revenue, 'total_pending' => $customerPending + $partyPending, 'daily_monthly_pending' => $customerPending, 'party_pending' => $partyPending, 'monthly_due_customers' => $monthlyDue, 'expenses' => $expenses]]);
    }
}
