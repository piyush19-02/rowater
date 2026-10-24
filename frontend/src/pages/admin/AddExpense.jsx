import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useAdmin } from "../../context/useAdmin";
import { api } from "../../lib/api";

const pageSizeOptions = [10, 20, 50];

export default function AddExpense() {
  const { currentAdmin } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [filterManagerId, setFilterManagerId] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [categoryResult, managerResult] = await Promise.all([
          api("/expense-categories"),
          api("/managers"),
        ]);
        setCategories(categoryResult.data || []);
        setManagers(managerResult.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filterCategoryId) query.set("category_id", String(filterCategoryId));
        if (filterManagerId) query.set("manager_id", String(filterManagerId));
        query.set("page", String(page));
        query.set("page_size", String(pageSize));

        const result = await api(`/expenses?${query.toString()}`);
        setExpenses(result.data || []);
        setTotal(result.total || 0);
      } catch (error) {
        console.error(error);
        setExpenses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [filterCategoryId, filterManagerId, page, pageSize]);

  const handleSave = async () => {
    if (!selectedCategoryId || !amount) {
      return setMessage("Category aur amount required hain.");
    }

    setSaving(true);
    setMessage("");

    // Validate added_by before sending: either a selected manager or a logged-in admin must be present
    const addedById = selectedManagerId ? Number(selectedManagerId) : (currentAdmin?.id || 0);
    if (!addedById) {
      setMessage("Admin se login karo ya manager select karo. added_by valid user id hona chahiye.");
      setSaving(false);
      return;
    }

    try {
      await api("/expenses", {
        method: "POST",
        body: {
          category_id: selectedCategoryId,
          amount,
          expense_date: expenseDate,
          description: desc,
          added_by: addedById,
        },
      });
      setMessage("Expense database mein save ho gaya.");
      setDesc("");
      setAmount("");
      setSelectedCategoryId("");
      setSelectedManagerId("");
      setExpenseDate(new Date().toISOString().slice(0, 10));
      setPage(1);
    } catch (error) {
      setMessage(error.message || "Expense save nahi hua.");
    } finally {
      setSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((item) => [item.id, item.category_name])), [categories]);

  return (
    <div className="flex bg-slate-100">
      <Sidebar />
      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">
        <p className="text-sm font-semibold text-blue-700">Admin control</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Expenses</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Record operating costs and review expenses by category or manager.</p>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Add expense</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="input mt-1">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.category_name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Amount
                <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="input mt-1" placeholder="0" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Expense date
                <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="input mt-1" />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Manager (optional)
                <select value={selectedManagerId} onChange={(e) => setSelectedManagerId(e.target.value)} className="input mt-1">
                  <option value="">None</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>{manager.name}</option>
                  ))}
                </select>
              </label>
              <label className="md:col-span-2 text-sm font-semibold text-slate-700">
                Description
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input mt-1 min-h-24" placeholder="Expense description" />
              </label>
            </div>
            {message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
            <button disabled={saving} onClick={handleSave} className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save expense"}
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Filter expenses</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
                <select value={filterCategoryId} onChange={(e) => { setFilterCategoryId(e.target.value); setPage(1); }} className="input mt-1">
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.category_name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Manager
                <select value={filterManagerId} onChange={(e) => { setFilterManagerId(e.target.value); setPage(1); }} className="input mt-1">
                  <option value="">All managers</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>{manager.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Page size
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="input mt-1">
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>{size} per page</option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Recent expenses</h2>
              <p className="text-sm text-slate-500">Category and manager filtering with pagination.</p>
            </div>
            <div className="text-sm text-slate-500">Total: {total}</div>
          </div>

          {loading ? (
            <p>Loading expenses…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[680px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Manager</th>
                    <th className="px-3 py-3">Description</th>
                    <th className="px-3 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length ? expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-3">{expense.expense_date}</td>
                      <td className="px-3 py-3">{expense.category_name || categoryMap[expense.category_id] || "-"}</td>
                      <td className="px-3 py-3">{expense.manager_name || (expense.added_by === 0 ? "Admin" : "Unknown")}</td>
                      <td className="px-3 py-3">{expense.description || "-"}</td>
                      <td className="px-3 py-3">₹{expense.amount}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-8 text-center text-slate-500">No expenses found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {page} of {pageCount}</span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
