/* eslint-disable react-hooks/set-state-in-effect -- initial API hydration */
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, Droplets, Package, WalletCards } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);

function blankForm(order = {}) {
  return {
    jar: order.jar ?? order.total_jars ?? 0,
    liter: order.liter ?? 0,
    orderAmount: order.amount ?? order.total_amount ?? 0,
    returnedJars: 0,
    receivedAmount: "",
    paymentMode: "cash",
    notes: "",
  };
}

/** Delivery workspace for both event/party and regular scheduled customers. */
export default function Delivery({ SidebarComponent = Sidebar, managerId }) {
  const [searchParams] = useSearchParams();
  const requestedOrderId = searchParams.get("order");
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") === "party" ? "party" : "regular");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries] = useState([]);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [regularStatus, setRegularStatus] = useState("pending");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState(blankForm());

  const load = async () => {
    try {
      const [customerResult, partyResult, deliveryResult] = await Promise.all([api("/customers"), api("/party-orders"), api("/deliveries?type=regular")]);
      setCustomers((customerResult.data || []).map((item) => ({ ...item, shop: item.address, pendingAmount: item.pending_amount, outsideJars: item.outside_jars })));
      setOrders((partyResult.data || []).map((item) => ({ ...item, customerName: item.customer_name, eventName: item.event_name, date: item.event_date, jar: item.total_jars, amount: item.total_amount, pending: item.pending_amount, pendingReturnJars: item.pending_return_jars, isParty: true })));
      setTodayDeliveries(deliveryResult.data || []);
    } catch (requestError) { setError(requestError.message); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!requestedOrderId || !orders.length) return;
    const order = orders.find((item) => String(item.id) === requestedOrderId);
    if (order) { setActiveTab("party"); setOpenId(`party-${order.id}`); setForm({ ...blankForm(order), lastDelivery: undefined }); }
  }, [orders, requestedOrderId]);

  const partyOrders = useMemo(() => orders.filter((order) => {
    const deliveryDate = order.date || order.event_date;
    return order.status !== "delivered" && order.status !== "completed" && (order.orderType === "guest" || order.isParty || (deliveryDate && deliveryDate >= today() && order.time === "Upcoming"));
  }).filter((order) => !order.deliveredAt), [orders]);

  const regularCustomers = useMemo(() => customers.filter((customer) =>
    customer.customerType !== "party" && customer.customer_status !== "inactive"
  ), [customers]);
  const completedCustomerIds = useMemo(() => new Set(todayDeliveries.filter((item) => item.delivery_status === "delivered").map((item) => String(item.customer_id))), [todayDeliveries]);
  const visibleRegularCustomers = useMemo(() => regularCustomers.filter((customer) => regularStatus === "completed" ? completedCustomerIds.has(String(customer.id)) : !completedCustomerIds.has(String(customer.id))), [regularCustomers, regularStatus, completedCustomerIds]);

  const historyFor = (customerId, partyOrderId) => deliveries
    .filter((item) => partyOrderId ? item.partyOrderId === partyOrderId : item.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const openDelivery = async (item, type) => {
    const history = historyFor(item.id, type === "party" ? item.id : null);
    setOpenId(`${type}-${item.id}`);
    setForm({ ...blankForm(item), lastDelivery: history[0] });
    if (type === "regular") {
      try { const result = await api(`/deliveries?customer_id=${item.id}&limit=3&all=1`); setForm((current) => ({ ...current, recentDeliveries: result.data || [] })); } catch { /* current delivery can continue without history */ }
    }
  };

  const save = async (item, type) => {
    const jar = Math.max(0, Number(form.jar) || 0);
    const liter = Math.max(0, Number(form.liter) || 0);
    const returnedJars = Math.max(0, Number(form.returnedJars) || 0);
    if (!jar && !liter) return window.alert("Jar ya water quantity enter karein.");

    const amount = type === "party"
      ? Number(item.amount || item.total_amount || jar * 60 + liter * 2)
      : jar * Number(item.rate_per_jar || 60) + liter * 2;
    const received = Math.min(amount, Math.max(0, Number(form.receivedAmount) || 0));
    const entry = {
      id: Date.now(),
      deliveryDate: today(),
      createdAt: new Date().toISOString(),
      type,
      partyOrderId: type === "party" ? item.id : null,
      customerId: type === "regular" ? item.id : item.customer_id || null,
      customerName: type === "party" ? item.customerName : item.name,
      mobile: item.mobile,
      jar,
      liter,
      returnedJars,
      amount,
      received,
      pendingAmount: amount - received,
      paymentStatus: received >= amount ? "paid" : "pending",
      paymentMode: received ? form.paymentMode : "credit",
      notes: form.notes,
    };
    try {
      await api("/deliveries", { method: "POST", body: { customer_id: entry.customerId, party_order_id: entry.partyOrderId, manager_id: managerId, delivery_date: entry.deliveryDate, delivered_jars: jar, delivered_water_liters: liter, returned_jars: returnedJars, amount, received_amount: received, payment_mode: entry.paymentMode, remarks: form.notes } });
      setOpenId(null); setForm(blankForm()); await load();
    } catch (requestError) { setError(requestError.message); }
  };

  const card = (item, type) => {
    const id = `${type}-${item.id}`;
    const isOpen = openId === id;
    const party = type === "party";
    const requestedJar = Number(item.jar ?? item.total_jars ?? 0);
    const requestedLiter = Number(item.liter ?? 0);
    const history = historyFor(item.id, party ? item.id : null);
    const last = history[0];
    const jarPending = party ? Number(item.pendingReturnJars || 0) : Number(item.outsideJars || 0);
    const accountPending = party ? Number(item.pending || item.pending_amount || 0) : Number(item.pendingAmount || 0);

    return <article key={id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3 justify-between">
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">{party ? item.customerName : item.name}</p>
          <p className="mt-1 text-sm text-slate-500 truncate">{party ? `${item.eventName || "Special occasion"} · ${item.date || "Date pending"}` : `${item.shop || item.address || "Address not added"} · ${item.mobile || ""}`}</p>
        </div>
        <button onClick={() => isOpen ? setOpenId(null) : openDelivery(item, type)} className="shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {isOpen ? "Close" : "Deliver"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
        {party && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Requested: {requestedJar} jar · {requestedLiter} L</span>}
        {jarPending > 0 && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">{jarPending} jar pending</span>}
        {accountPending > 0 && <span className="rounded-full bg-red-100 px-2.5 py-1 text-red-700">Payment pending {money(accountPending)}</span>}
        {last && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Last: {last.deliveryDate} · {last.jar} jar</span>}
      </div>

      {isOpen && <DeliveryForm form={form} setForm={setForm} party={party} requested={{ jar: requestedJar, liter: requestedLiter }} onSave={() => save(item, type)} error={error} />}
    </article>;
  };

  return <div className="flex bg-slate-100">
    {React.createElement(SidebarComponent)}
    <main className="min-h-screen w-full pb-24 md:ml-60 md:p-6 p-4">
      <header className="mb-5">
        <p className="text-sm font-semibold text-blue-700">Delivery workspace</p>
        <h1 className="text-2xl font-bold text-slate-900">Aaj ki delivery</h1>
        <p className="mt-1 text-sm text-slate-500">Payment aur jar return delivery ke saath hi record karein.</p>
      </header>
      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-200 p-1">
        <button onClick={() => { setActiveTab("regular"); setOpenId(null); }} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "regular" ? "bg-white text-blue-700 shadow" : "text-slate-600"}`}>Delivery pending ({regularCustomers.length - completedCustomerIds.size})</button>
        <button onClick={() => { setActiveTab("party"); setOpenId(null); }} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "party" ? "bg-white text-blue-700 shadow" : "text-slate-600"}`}>Party orders ({partyOrders.length})</button>
      </div>
      {activeTab === "regular" && <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-200 p-1"><button onClick={() => setRegularStatus("pending")} className={`rounded-lg py-2 text-sm font-bold ${regularStatus === "pending" ? "bg-white text-amber-700 shadow" : "text-slate-600"}`}>Pending ({regularCustomers.length - completedCustomerIds.size})</button><button onClick={() => setRegularStatus("completed")} className={`rounded-lg py-2 text-sm font-bold ${regularStatus === "completed" ? "bg-white text-emerald-700 shadow" : "text-slate-600"}`}>Completed ({completedCustomerIds.size})</button></div>}
      <section className="space-y-3">
        {(activeTab === "party" ? partyOrders : visibleRegularCustomers).map((item) => card(item, activeTab === "party" ? "party" : "regular"))}
        {(activeTab === "party" ? partyOrders : visibleRegularCustomers).length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Is list mein abhi koi delivery pending nahi hai.</div>}
      </section>
    </main>
  </div>;
}

function DeliveryForm({ form, setForm, party, requested, onSave, error }) {
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const jar = Number(form.jar || 0); const liter = Number(form.liter || 0);
  const received = Math.max(0, Number(form.receivedAmount) || 0);
  const chargedAmount = party && Number(form.orderAmount) > 0 ? Number(form.orderAmount) : jar * 60 + liter * 2;
  return <div className="mt-4 border-t border-slate-100 pt-4">
    {party && <p className="mb-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900"><CalendarDays className="mr-1 inline" size={16} /> Requested {requested.jar} jar / {requested.liter} L. Delivered quantity isse zyada bhi ho sakti hai.</p>}
    <div className="grid grid-cols-2 gap-3">
      <Field label="Jar delivery" icon={<Package size={16} />}><input type="number" min="0" value={form.jar} onChange={(e) => update("jar", e.target.value)} className="input" /></Field>
      <Field label="Water delivery (L)" icon={<Droplets size={16} />}><input type="number" min="0" value={form.liter} onChange={(e) => update("liter", e.target.value)} className="input" /></Field>
      <Field label="Last jar returned" icon={<CheckCircle2 size={16} />}><input type="number" min="0" value={form.returnedJars} onChange={(e) => update("returnedJars", e.target.value)} className="input" /></Field>
      <Field label="Received amount now" icon={<WalletCards size={16} />}><input type="number" min="0" value={form.receivedAmount} onChange={(e) => update("receivedAmount", e.target.value)} className="input" placeholder="0" /></Field>
    </div>
    {received > 0 && <select value={form.paymentMode} onChange={(e) => update("paymentMode", e.target.value)} className="input mt-3"><option value="cash">Cash</option><option value="upi">UPI</option><option value="online">Online</option></select>}
    <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Delivery note (optional)" className="input mt-3 min-h-20" />
    {!party && form.recentDeliveries?.length > 0 && <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><p className="mb-1 font-bold">Last 3 deliveries</p>{form.recentDeliveries.map((delivery) => <p key={delivery.id}>{delivery.delivery_date} · {delivery.delivered_jars} jar · ₹{delivery.received_amount} received</p>)}</div>}
    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{jar} jar · {liter} L</span><span className="font-bold">Order amount ₹{chargedAmount} · Pending ₹{Math.max(0, chargedAmount - received)}</span></div>
    {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button onClick={onSave} className="mt-3 w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">Confirm delivery</button>
  </div>;
}

function Field({ label, icon, children }) { return <label className="text-sm font-semibold text-slate-700"><span className="mb-1 flex items-center gap-1">{icon}{label}</span>{children}</label>; }
