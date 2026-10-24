import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Package, X } from "lucide-react";
import { useManager } from "../../context/ManagerContext";
import ManagerSidebar from "../../components/ManagerSidebar";
import { api } from "../../lib/api";
export default function PendingJars() {
  const { currentManager } = useManager();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [received, setReceived] = useState("");
  const [returned, setReturned] = useState("");
  const [paymentState, setPaymentState] = useState("pending");
  const [jarState, setJarState] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  const load = async () => {
    try {
      const result = await api("/deliveries/pending");
      const merged = [...(result.data.customers || []), ...(result.data.party_orders || [])];
      setPending(merged);
      setCompleted(result.data.completed_party_orders || []);

      // If a customer_id or party_id is passed in query, auto-open that row after load
      const params = new URLSearchParams(location.search);
      const preCustomer = params.get("customer_id") || params.get("id") || params.get("customer");
      const preParty = params.get("party_id");
      if (preCustomer) {
        const row = merged.find(r => String(r.id) === String(preCustomer) && (r.type === 'customer' || !r.type));
        if (row) {
          // Open after a tick to ensure state updates
          setTimeout(() => open(row), 50);
        }
      } else if (preParty) {
        const row = merged.find(r => String(r.id) === String(preParty) && r.type === 'party');
        if (row) setTimeout(() => open(row), 50);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = async (row) => {
    setSelected({ ...row, history: null, loadingHistory: true });
    setReceived("");
    setReturned("");
    setPaymentState(Number(row.pending_amount) ? "pending" : "completed");
    setJarState(Number(row.pending_jars) ? "pending" : "completed");

    // fetch history: payments, jar returns, and manager info
    try {
      if (row.type === 'customer') {
        const res = await api(`/customers/${row.id}/statement`);
        // API returns { status: true, data: { entries: [...] } }
        const entries = (res.data && res.data.entries) || (res.data && res.data.entries) || (res.data && res.entries) || (res.data?.entries) || (res?.data?.entries) || (res?.entries) || [];
        // The canonical payload from server is res.data.entries (because api() returns parsed payload). Handle both shapes defensively.
        const normalized = (res.data && res.data.entries ? res.data.entries : (res.data || []).map ? res.data : (res.entries || []));
        setSelected((s) => ({ ...s, history: normalized || entries, loadingHistory: false }));
      } else if (row.type === 'party') {
        // fetch party deliveries + payments + managers to show who did what
        const [deliveriesPayload, paymentsPayload, managersPayload] = await Promise.all([
          api(`/deliveries?type=party&all=1&limit=1000`),
          api(`/payments?party_order_id=${row.id}`),
          api(`/managers`),
        ]);
        const deliveries = (deliveriesPayload.data || []).filter(d => Number(d.party_order_id) === Number(row.id));
        const payments = (paymentsPayload.data || []);
        const managers = (managersPayload.data || []);
        const mgrMap = {};
        managers.forEach(m => { mgrMap[m.id] = m.name; });

        const entries = [];
        deliveries.forEach(d => {
          entries.push({ type: 'delivery', date: d.delivery_date || d.date || d.created_at || d.delivery_date, amount: Number(d.received_amount || d.amount || 0), jars: Number(d.delivered_jars || d.delivered_jars || 0), manager: mgrMap[d.manager_id] || d.manager_name || null });
        });
        payments.forEach(p => {
          entries.push({ type: 'payment', date: p.payment_date || p.date || p.created_at, amount: Number(p.amount || 0), jars: 0, manager: p.manager_name || mgrMap[p.received_by] || null });
        });
        entries.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSelected((s) => ({ ...s, history: entries, loadingHistory: false }));
      } else {
        setSelected((s) => ({ ...s, history: [], loadingHistory: false }));
      }
    } catch {
      setSelected((s) => ({ ...s, history: [], loadingHistory: false }));
    }
  };

  const settle = async () => {
    if (!selected) return;
    const amount = paymentState === "completed" ? Number(selected.pending_amount) : Number(received || 0);
    const jars = jarState === "completed" ? Number(selected.pending_jars) : Number(returned || 0);
    setSaving(true);

    const body = {
      id: selected.id,
      type: selected.type,
      received_amount: amount,
      returned_jars: jars,
      payment_mode: "cash",
      manager_id: currentManager?.id,
    };

    try {
      await api("/deliveries/settle", { method: "POST", body });
      setSelected(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = tab === "pending" ? pending : completed;
  return <div className="flex min-h-screen bg-slate-100"><ManagerSidebar /><main className="w-full p-4 pb-24 md:ml-60 md:p-6"><p className="text-sm font-semibold text-amber-700">Jar & payment tracking</p><h1 className="mb-4 text-2xl font-bold">Pending jars</h1><div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-200 p-1"><button onClick={() => setTab("pending")} className={`rounded-lg py-2 font-bold ${tab === "pending" ? "bg-white text-amber-700 shadow" : "text-slate-600"}`}>Pending ({pending.length})</button><button onClick={() => setTab("completed")} className={`rounded-lg py-2 font-bold ${tab === "completed" ? "bg-white text-emerald-700 shadow" : "text-slate-600"}`}>Completed ({completed.length})</button></div>{error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{rows.length ? <div className="space-y-3">{rows.map((row) => <button key={`${row.type}-${row.id}`} onClick={() => { if (tab === "pending") return open(row); if (tab === "completed") { if (row.type === 'party') return navigate(`/manager/order/${row.id}`); /* else: no-op */ } }} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm"><div><p className="font-bold">{row.name}</p><p className="text-sm text-slate-500">{row.event_name || row.address || "Customer"}</p><p className={tab === "pending" ? "mt-1 text-sm font-semibold text-red-600" : "mt-1 text-sm font-semibold text-emerald-600"}>{tab === "pending" ? `Payment pending: ₹${row.pending_amount}` : "Payment and jars cleared"}</p></div>{tab === "pending" ? <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-2 text-sm font-bold text-amber-800"><Package size={16} />{row.pending_jars} jar</span> : <CheckCircle2 className="text-emerald-600" />}</button>)}</div> : <p className="rounded-2xl bg-white p-8 text-center text-slate-500">{tab === "pending" ? "Koi pending jar ya payment nahi hai." : "Abhi koi completed party order nahi hai."}</p>}{selected && <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center md:p-4"><div className="w-full max-w-2xl rounded-t-3xl bg-white p-5 md:rounded-3xl"><div className="mb-4 flex justify-between"><div><h2 className="font-bold">{selected.name}</h2><p className="text-sm text-slate-500">Payment ₹{selected.pending_amount} · Jar {selected.pending_jars}</p></div><button onClick={() => setSelected(null)}><X /></button></div>{/* History section */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">History</h3>
        {selected.loadingHistory ? <p className="text-sm text-slate-500">Loading history...</p> : (
          selected.history && selected.history.length ? (
            <div className="space-y-2 max-h-64 overflow-auto rounded-lg border p-2">
              {selected.history.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between border-b py-2 text-sm">
                  <div>
                    <div className="font-medium">{h.type === 'delivery' ? 'Delivery' : h.type === 'payment' ? 'Payment' : (h.type || 'Entry')}</div>
                    <div className="text-slate-500">{h.manager ? `By: ${h.manager}` : ''} {h.date ? `· ${new Date(h.date).toLocaleString()}` : ''}</div>
                  </div>
                  <div className="text-right">
                    {h.amount ? <div>₹{h.amount}</div> : null}
                    {h.jars ? <div className="text-xs text-amber-700">{h.jars} jar{h.jars>1?'s':''}</div> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-500">Koi history nahi mili.</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Payment status<select value={paymentState} onChange={(e) => setPaymentState(e.target.value)} className="input mt-1"><option value="pending">Pending</option><option value="completed">Completed</option></select></label><label className="text-sm font-semibold">Jar status<select value={jarState} onChange={(e) => setJarState(e.target.value)} className="input mt-1"><option value="pending">Pending</option><option value="completed">Completed</option></select></label></div>{paymentState === "pending" && <label className="mb-3 block text-sm font-semibold">Payment received now<input type="number" min="0" max={selected.pending_amount} value={received} onChange={(e) => setReceived(e.target.value)} className="input mt-1" placeholder="0" /></label>}{jarState === "pending" && <label className="mb-4 block text-sm font-semibold">Jar returned now (out of {selected.pending_jars})<input type="number" min="0" max={selected.pending_jars} value={returned} onChange={(e) => setReturned(e.target.value)} className="input mt-1" placeholder="0" /></label>}<p className="mb-3 rounded-xl bg-slate-50 p-3 text-sm">Completed choose karne par full pending payment/jar clear hoga. Dono complete hone par order Completed tab mein chala jayega.</p><button disabled={saving} onClick={settle} className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Update status"}</button></div></div>}</main></div>; }
