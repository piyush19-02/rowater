import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const emptyManager = {
  name: "",
  mobile: "",
  email: "",
  password: "",
  vehicle_no: "",
  role: "manager",
  status: "active",
};

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState(emptyManager);
  const [selectedManager, setSelectedManager] = useState(null);
  const [details, setDetails] = useState({ deliveries: [], expenses: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const loadManagers = async () => {
    setError("");
    setInfo("");
    try {
      const result = await api("/managers");
      const list = result.data || [];
      setManagers(list);
      if (!list.length) {
        setInfo("No managers found on server. You can add one here.");
      }
    } catch (error) {
      setError(error.message || "Unable to load managers from server.");
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagerDeliveries = async (managerId) => {
    const result = await api(`/deliveries?manager_id=${managerId}&all=1`);
    return Array.isArray(result.data) ? result.data : [];
  };

  const loadManagerExpenses = async (managerId) => {
    const result = await api(`/expenses?manager_id=${managerId}&all=1`);
    return Array.isArray(result.data) ? result.data : [];
  };

  const loadManagerDetails = async (manager) => {
    if (!manager?.id) return;
    setError("");
    setLoading(true);
    setSelectedManager(manager);

    try {
      const [deliveries, expenses] = await Promise.all([
        loadManagerDeliveries(manager.id),
        loadManagerExpenses(manager.id),
      ]);
      setDetails({ deliveries, expenses });
    } catch (e) {
      setError(e.message || "Manager details load failed.");
      setDetails({ deliveries: [], expenses: [] });
    } finally {
      setLoading(false);
    }
  };

  const saveManager = async () => {
    if (!form.name.trim() || !form.mobile.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Sab fields fill karo, password bhi required hai.");
      return;
    }

    setSaving(true);
    setError("");
    setInfo("");

    try {
      await api("/managers", {
        method: "POST",
        body: { ...form },
      });
      setForm(emptyManager);
      setInfo("Manager server par save ho gaya.");
      await loadManagers();
    } catch (error) {
      setError(error.message || "Failed to save manager to the server.");
    } finally {
      setSaving(false);
    }
  };

  const totalReceived = useMemo(() => {
    return details.deliveries.reduce((sum, item) => sum + Number(item.received_amount ?? item.received ?? 0), 0);
  }, [details.deliveries]);

  const totalDeliveryAmount = useMemo(() => {
    return details.deliveries.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  }, [details.deliveries]);

  const totalExpenses = useMemo(() => {
    return details.expenses.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  }, [details.expenses]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">
        <header className="mb-5">
          <p className="text-sm font-semibold text-blue-700">Admin control</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Manage managers</h1>
          <p className="mt-1 text-sm text-slate-500">Yahan se manager add karo aur unki deliveries / expenses dekho.</p>
        </header>

        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {info && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{info}</p>}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Add manager / admin</h2>
            <p className="mb-4 text-sm text-slate-500">Choose role manager for delivery staff, or admin to create a backend admin account.</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name"><input value={form.name} onChange={(e) => setForm((old) => ({ ...old, name: e.target.value }))} className="input" /></Field>
              <Field label="Mobile"><input value={form.mobile} onChange={(e) => setForm((old) => ({ ...old, mobile: e.target.value }))} className="input" /></Field>
              <Field label="Email"><input value={form.email} onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))} className="input" /></Field>
              <Field label="Password"><input type="password" value={form.password} onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))} className="input" /></Field>
              <Field label="Vehicle No" wide><input value={form.vehicle_no} onChange={(e) => setForm((old) => ({ ...old, vehicle_no: e.target.value }))} className="input" /></Field>
              <Field label="Role"><select value={form.role} onChange={(e) => setForm((old) => ({ ...old, role: e.target.value }))} className="input"><option value="manager">Manager</option><option value="admin">Admin</option></select></Field>
              <Field label="Status"><select value={form.status} onChange={(e) => setForm((old) => ({ ...old, status: e.target.value }))} className="input"><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
            </div>
            <button disabled={saving} onClick={saveManager} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Add manager"}
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Manager details</h2>
            {selectedManager ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold">{selectedManager.name}</h3>
                  <p className="text-sm text-slate-500">{selectedManager.email} · {selectedManager.mobile}</p>
                  <p className="mt-2 text-sm">Vehicle no: {selectedManager.vehicle_no || "N/A"} · Status: {selectedManager.status || "active"}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <Stat label="Total deliveries" value={details.deliveries.length} />
                  <Stat label="Total amount" value={`₹${totalDeliveryAmount}`} />
                  <Stat label="Received amount" value={`₹${totalReceived}`} />
                  <Stat label="Total expenses" value={`₹${totalExpenses}`} />
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold mb-3">Recent deliveries</h3>
                  {loading ? <p>Loading...</p> : details.deliveries.length ? details.deliveries.slice(0, 5).map((delivery) => (
                    <div key={delivery.id || `${delivery.deliveryDate}-${delivery.amount}`} className="border-t py-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span>{delivery.delivery_date || delivery.deliveryDate || delivery.date || "-"}</span>
                        <span className="font-semibold">₹{delivery.received_amount ?? delivery.received ?? 0}</span>
                      </div>
                      <p className="text-slate-500">{delivery.delivered_jars ?? delivery.jar ?? 0} jar · {delivery.delivered_water_liters ?? delivery.liter ?? 0} L</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No deliveries found.</p>}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold mb-3">Recent expenses</h3>
                  {loading ? <p>Loading...</p> : details.expenses.length ? details.expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id || expense.expense_date || expense.description} className="border-t py-2 text-sm">
                      <div className="flex items-center justify-between gap-3"><span>{expense.expense_date || expense.date || "-"}</span><span className="font-semibold">₹{expense.amount || 0}</span></div>
                      <p className="text-slate-500">{expense.description || expense.category_name || "Expense"}</p>
                    </div>
                  )) : <p className="text-sm text-slate-500">No expenses found.</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Manager pe click karo list mein unki delivery / expense dekhne ke liye.</p>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900">Managers</h2>
            <p className="text-sm text-slate-500">Total: {managers.length}</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[720px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Mobile</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Vehicle</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager.id} className="border-b hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-900">{manager.name}</td>
                    <td className="px-3 py-3">{manager.mobile}</td>
                    <td className="px-3 py-3">{manager.email}</td>
                    <td className="px-3 py-3">{manager.vehicle_no || "-"}</td>
                    <td className="px-3 py-3">{manager.status || "active"}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => loadManagerDetails(manager)} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`text-sm font-semibold text-slate-700 ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
