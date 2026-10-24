import React, { useEffect, useMemo, useState } from "react";
import { useManager } from "../../context/ManagerContext";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const empty = {
  customer_id: "",
  customer_name: "",
  mobile: "",
  address: "",
  event_name: "",
  event_type: "Wedding",
  event_date: "",
  event_time: "",
  delivery_address: "",
  total_jars: "",
  water_liters: "",
  rate: "60",
  water_rate: "2",
  advance: "",
  remarks: "",
};

export default function AddPartyOrder({ SidebarComponent = Sidebar }) {
  const { currentManager } = useManager();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/customers").then((result) => setCustomers(result.data || [])).catch((error) => setMessage(error.message));
  }, []);

  const total = useMemo(
    () => Number(form.total_jars || 0) * Number(form.rate || 0) + Number(form.water_liters || 0) * Number(form.water_rate || 0),
    [form],
  );
  const pending = Math.max(0, total - Number(form.advance || 0));
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const selectCustomer = (id) => {
    const customer = customers.find((item) => String(item.id) === id);
    update("customer_id", id);
    if (customer) {
      setForm((old) => ({
        ...old,
        customer_id: id,
        customer_name: customer.name,
        mobile: customer.mobile,
        address: customer.address,
        delivery_address: customer.address,
      }));
    }
  };

  const save = async () => {
    setSaving(true);
    setMessage("");

    const body = {
      ...form,
      total_amount: total,
      pending_amount: pending,
      ...(currentManager?.id ? { manager_id: currentManager.id } : {}),
    };

    try {
      await api("/party-orders", { method: "POST", body });
      setMessage("Party order saved successfully.");
      setForm(empty);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {React.createElement(SidebarComponent)}
      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">
        <header className="mb-6">
          <p className="text-sm font-semibold text-blue-700">Party / special occasion</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Add party order</h1>
          <p className="mt-1 text-sm text-slate-500">Add event details, delivery quantities, and payment information.</p>
        </header>

        <section className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Existing customer (optional)">
              <select value={form.customer_id} onChange={(e) => selectCustomer(e.target.value)} className="input">
                <option value="">New / guest customer</option>
                {customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name} ({customer.mobile})</option>)}
              </select>
            </Field>
            <Field label="Customer name *">
              <input value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} className="input" />
            </Field>
            <Field label="Mobile *">
              <input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} className="input" />
            </Field>
            <Field label="Customer address">
              <input value={form.address} onChange={(e) => update("address", e.target.value)} className="input" />
            </Field>
            <Field label="Event name *">
              <input value={form.event_name} onChange={(e) => update("event_name", e.target.value)} placeholder="e.g. Rahul & Priya wedding" className="input" />
            </Field>
            <Field label="Event type">
              <select value={form.event_type} onChange={(e) => update("event_type", e.target.value)} className="input">
                <option>Wedding</option>
                <option>Birthday</option>
                <option>House function</option>
                <option>Corporate event</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Event / delivery date *">
              <input type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} className="input" />
            </Field>
            <Field label="Event time">
              <input type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} className="input" />
            </Field>
            <Field label="Delivery address" wide>
              <textarea value={form.delivery_address} onChange={(e) => update("delivery_address", e.target.value)} className="input min-h-24" />
            </Field>
            <Field label="Jar quantity">
              <input type="number" min="0" value={form.total_jars} onChange={(e) => update("total_jars", e.target.value)} className="input" />
            </Field>
            <Field label="Jar rate">
              <input type="number" min="0" value={form.rate} onChange={(e) => update("rate", e.target.value)} className="input" />
            </Field>
            <Field label="Water quantity (litres)">
              <input type="number" min="0" value={form.water_liters} onChange={(e) => update("water_liters", e.target.value)} className="input" />
            </Field>
            <Field label="Water rate / litre">
              <input type="number" min="0" value={form.water_rate} onChange={(e) => update("water_rate", e.target.value)} className="input" />
            </Field>
            <Field label="Advance / received now">
              <input type="number" min="0" value={form.advance} onChange={(e) => update("advance", e.target.value)} className="input" />
            </Field>
            <Field label="Remarks" wide>
              <textarea value={form.remarks} onChange={(e) => update("remarks", e.target.value)} className="input min-h-24" placeholder="Instructions, contact person, etc." />
            </Field>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-center sm:grid-cols-3">
            <div><p className="text-xs text-slate-500">Total</p><b className="mt-1 block text-lg text-slate-900">₹{total}</b></div>
            <div><p className="text-xs text-slate-500">Received</p><b className="mt-1 block text-lg text-emerald-700">₹{form.advance || 0}</b></div>
            <div><p className="text-xs text-slate-500">Pending</p><b className="mt-1 block text-lg text-red-700">₹{pending}</b></div>
          </div>
          {message && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}
          <button disabled={saving} onClick={save} className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save party order"}
          </button>
        </section>
      </main>
    </div>
  );
}

function Field({ label, wide, children }) {
  return (
    <label className={`text-sm font-semibold text-slate-700 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}
