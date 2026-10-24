import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Plus, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
export default function Customers({ SidebarComponent = Sidebar, title = "Customers" }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", mobile: "", address: "", security_deposit: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // filters / pagination
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [customerStatus, setCustomerStatus] = useState("");
  const [filterPending, setFilterPending] = useState(false);
  const [filterPendingJars, setFilterPendingJars] = useState(false);
  const [filterDepositMin, setFilterDepositMin] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);

  // Statement modal state
  const [statementOpen, setStatementOpen] = useState(false);
  const [statementData, setStatementData] = useState(null);
  const [statementMonth, setStatementMonth] = useState(new Date().toISOString().slice(0,7));
  const [statementLoading, setStatementLoading] = useState(false);
  const [statementError, setStatementError] = useState("");
  const [statementCustomerId, setStatementCustomerId] = useState(null);
  const [settlementCustomer, setSettlementCustomer] = useState(null);
  const [settlementError, setSettlementError] = useState("");
  const [settlementReceived, setSettlementReceived] = useState("");
  const [settlementReturned, setSettlementReturned] = useState("");
  const [settlementPaymentState, setSettlementPaymentState] = useState("pending");
  const [settlementJarState, setSettlementJarState] = useState("pending");
  const [settlementSaving, setSettlementSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isManagerContext = location.pathname.startsWith("/manager");

  const load = async () => {
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (customerType) qs.set("customer_type", customerType);
      if (customerStatus) qs.set("customer_status", customerStatus);
      if (filterPending) qs.set("pending", "1");
      if (filterPendingJars) qs.set("pending_jars", "1");
      if (filterDepositMin) qs.set("deposit_min", String(filterDepositMin));
      qs.set("page", String(page));
      qs.set("page_size", String(pageSize));

      const result = await api(`/customers?${qs.toString()}`);
      setCustomers(result.data || []);
      setTotal(result.total || 0);
    } catch (e) {
      setError(e.message);
    }
  };


  useEffect(() => {
    // inline the load logic to avoid setState-in-effect lint warning
    (async function fetchCustomers(){
      try {
        const qs = new URLSearchParams();
        if (search) qs.set("search", search);
        if (customerType) qs.set("customer_type", customerType);
        if (customerStatus) qs.set("customer_status", customerStatus);
        if (filterPending) qs.set("pending", "1");
        if (filterPendingJars) qs.set("pending_jars", "1");
        if (filterDepositMin) qs.set("deposit_min", String(filterDepositMin));
        qs.set("page", String(page));
        qs.set("page_size", String(pageSize));

        const result = await api(`/customers?${qs.toString()}`);
        setCustomers(result.data || []);
        setTotal(result.total || 0);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [search, customerType, customerStatus, filterPending, filterPendingJars, filterDepositMin, page, pageSize]);

  const save = async () => {
    try {
      await api("/customers", { method: "POST", body: form });
      setForm({ name: "", mobile: "", address: "", security_deposit: "" });
      setShow(false);
      setPage(1);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const exportCsv = (statement) => {
    if (!statement) return;
    const rows = [["Date", "Type", "Description", "Debit", "Credit", "Balance"]];
    rows.push(["", "", "Opening balance", "", "", statement.opening_balance?.toFixed(2) || "0.00"]);
    statement.entries.forEach((entry) => {
      rows.push([
        entry.date,
        entry.type,
        entry.description,
        entry.debit?.toFixed(2) || "0.00",
        entry.credit?.toFixed(2) || "0.00",
        entry.balance?.toFixed(2) || "0.00",
      ]);
    });
    rows.push(["", "", "Totals", statement.totals.debit.toFixed(2), statement.totals.credit.toFixed(2), statement.totals.net.toFixed(2)]);
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `statement-${statement.customer?.id || 'customer'}-${statement.month}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printStatement = (statement) => {
    if (!statement) return;
    const html = `
      <html>
        <head>
          <title>Statement ${statement.customer?.name || ''} - ${statement.month}</title>
          <style>body{font-family:Arial,sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px;border:1px solid #ccc;text-align:left;}thead{background:#f4f4f4;}</style>
        </head>
        <body>
          <h1>Statement for ${statement.customer?.name || 'Customer'}</h1>
          <p>Period: ${statement.start} to ${statement.end}</p>
          <p>Opening balance: ₹${statement.opening_balance?.toFixed(2) || '0.00'}</p>
          <table>
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead>
            <tbody>
              ${statement.entries.map((entry) => `<tr><td>${entry.date}</td><td>${entry.type}</td><td>${entry.description}</td><td style="text-align:right;">${entry.debit?.toFixed(2) || '0.00'}</td><td style="text-align:right;">${entry.credit?.toFixed(2) || '0.00'}</td><td style="text-align:right;">${entry.balance?.toFixed(2) || '0.00'}</td></tr>`).join("")}
            </tbody>
            <tfoot>
              <tr><td colspan="3"><strong>Totals</strong></td><td style="text-align:right;"><strong>${statement.totals.debit.toFixed(2)}</strong></td><td style="text-align:right;"><strong>${statement.totals.credit.toFixed(2)}</strong></td><td style="text-align:right;"><strong>${statement.totals.net.toFixed(2)}</strong></td></tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open("", "StatementPrint");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const openStatement = async (customerId) => {
    setStatementCustomerId(customerId);
    setStatementOpen(true);
    setStatementData(null);
    setStatementError("");
    setStatementLoading(true);
    try {
      const result = await api(`/customers/${customerId}/statement?month=${statementMonth}`);
      setStatementData(result.data || null);
    } catch (err) {
      setStatementError(err.message || "Failed to load statement.");
    } finally {
      setStatementLoading(false);
    }
  };

  const closeStatement = () => {
    setStatementOpen(false);
    setStatementData(null);
    setStatementCustomerId(null);
    setStatementError("");
  };

  const openSettlement = (customer) => {
    const selected = {
      ...customer,
      pending_amount: Number(customer.pending_amount || 0),
      pending_jars: Number(customer.outside_jars || 0),
    };
    setSettlementCustomer(selected);
    setSettlementError("");
    setSettlementReceived("");
    setSettlementReturned("");
    setSettlementPaymentState(selected.pending_amount > 0 ? "pending" : "completed");
    setSettlementJarState(selected.pending_jars > 0 ? "pending" : "completed");
  };

  const settleCustomer = async () => {
    if (!settlementCustomer) return;
    setSettlementSaving(true);
    setSettlementError("");
    try {
      await api("/deliveries/settle", {
        method: "POST",
        body: {
          id: settlementCustomer.id,
          type: "customer",
          received_amount: settlementPayment,
          returned_jars: settlementJars,
          payment_mode: "cash",
        },
      });
      setSettlementCustomer(null);
      load();
    } catch (err) {
      setSettlementError(err.message || "Failed to settle customer balance.");
    } finally {
      setSettlementSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const settlementPayment = settlementCustomer
    ? settlementPaymentState === "completed"
      ? settlementCustomer.pending_amount
      : Math.max(0, Math.min(settlementCustomer.pending_amount, Number(settlementReceived || 0)))
    : 0;
  const settlementJars = settlementCustomer
    ? settlementJarState === "completed"
      ? settlementCustomer.pending_jars
      : Math.max(0, Math.min(settlementCustomer.pending_jars, Number(settlementReturned || 0)))
    : 0;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {React.createElement(SidebarComponent)}
      <main className="w-full p-4 pb-24 md:ml-60 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-700">Customer management</p>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <button onClick={() => setShow(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-blue-700"><Plus size={18} />Add customer</button>
        </div>

        {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {/* Filters */}
        <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input" placeholder="Search name or mobile" />
          <select value={customerType} onChange={(e) => { setCustomerType(e.target.value); setPage(1); }} className="input">
            <option value="">All types</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
          <select value={customerStatus} onChange={(e) => { setCustomerStatus(e.target.value); setPage(1); }} className="input">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={filterPending} onChange={(e) => { setFilterPending(e.target.checked); setPage(1); }} /> Only pending amount</label>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={filterPendingJars} onChange={(e) => { setFilterPendingJars(e.target.checked); setPage(1); }} /> Only pending jars</label>
          </div>
          <input type="number" value={filterDepositMin} onChange={(e) => { setFilterDepositMin(e.target.value); setPage(1); }} className="input" placeholder="Min security deposit" />
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="input">
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>

        <div className="space-y-3">
          {customers.map((c) => {
            const due = Number(c.pending_amount || 0);
            const message = encodeURIComponent(`Namaste ${c.name}, aapka RO Water ka pending amount ₹${due} hai. Kripya payment kar dein. Dhanyavaad.`);
            return (
              <article key={c.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-bold text-slate-900">{c.name}</p>
                  <p className="text-sm text-slate-500">{c.address} · {c.mobile}</p>
                  <p className="text-sm text-slate-500">Start date: {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</p>
                  <p className={due ? "mt-2 text-sm font-bold text-red-600" : "mt-2 text-sm font-bold text-emerald-600"}>Pending: ₹{due} · Customer ke paas: {c.outside_jars || 0} jar · Deposit: ₹{c.security_deposit || 0}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button onClick={() => openStatement(c.id)} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">View statement</button>
                  {due > 0 && <button onClick={() => openStatement(c.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Pending due</button>}
                  {(due > 0 || Number(c.outside_jars || 0) > 0) && <button onClick={() => openSettlement(c)} className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-200">Settle</button>}
                  <a aria-label={`WhatsApp ${c.name}`} href={`https://wa.me/91${c.mobile}?text=${message}`} target="_blank" rel="noreferrer" className="rounded-full bg-green-50 p-2.5 text-green-700 transition hover:bg-green-100"><MessageCircle size={20} /></a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
          <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
          <div className="px-2 text-sm text-slate-600">Page {page} of {pageCount}</div>
          <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium disabled:opacity-40" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Next</button>
          <div className="ml-auto text-sm text-slate-600">Total: {total}</div>
        </div>

        {show && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 md:items-center md:p-4">
            <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl md:rounded-3xl">
              <h2 className="mb-4 text-lg font-bold">Add customer</h2>
              {[ ["name","Name"],["mobile","Mobile"],["address","Shop / address"],["security_deposit","Jar security deposit"] ].map(([key,label]) => (
                <input key={key} type={key === "security_deposit" ? "number" : "text"} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="input mb-3" placeholder={label} />
              ))}
              <button onClick={save} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white">Save customer</button>
            </div>
          </div>
        )}

        {/* Statement modal */}
        {statementOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 md:items-center md:p-4">
            <div className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:rounded-3xl md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Statement for {statementData?.customer?.name || 'Customer'}</h2>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <input type="month" value={statementMonth} onChange={(e) => setStatementMonth(e.target.value)} className="input" />
                  <button onClick={() => openStatement(statementCustomerId)} className="rounded-lg bg-slate-100 px-3 py-2">Load</button>
                  <button onClick={closeStatement} className="rounded-lg bg-slate-100 px-3 py-2">Close</button>
                </div>
              </div>
              {statementLoading && <p>Loading...</p>}
              {statementError && <p className="text-red-600">{statementError}</p>}
              {statementData && (
                <div>
                  <p className="text-sm text-slate-600">Period: {statementData.start} to {statementData.end}</p>
                  <div className="mb-3 grid gap-3 sm:grid-cols-2">
                    <p className="text-sm">Opening balance: <strong>₹{statementData.opening_balance?.toFixed(2)}</strong></p>
                    <p className="text-sm">Jars delivered this month: <strong>{statementData.entries?.reduce((sum, entry) => sum + Number(entry.meta?.delivered_jars || 0), 0) ?? 0}</strong></p>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">Statement total: <strong>₹{statementData.totals?.net?.toFixed(2) || '0.00'}</strong></p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => exportCsv(statementData)} className="rounded-lg bg-slate-100 px-3 py-2">Export CSV</button>
                  <button onClick={() => printStatement(statementData)} className="rounded-lg bg-slate-100 px-3 py-2">Print</button>
                </div>
              </div>
              {isManagerContext && (
                <button onClick={() => navigate('/manager/pending-jars')} className="mb-3 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">Go to Pending Jars</button>
              )}
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full min-w-[620px] table-auto text-sm">
                <thead>
                  <tr className="text-left"><th>Date</th><th>Type</th><th>Description</th><th className="text-right">Debit</th><th className="text-right">Credit</th><th className="text-right">Balance</th></tr>
                </thead>
                <tbody>
                  {statementData.entries.map((e, idx) => (
                    <tr key={idx} className="border-t"><td>{e.date}</td><td>{e.type}</td><td>{e.description}</td><td className="text-right">{e.debit ? e.debit.toFixed(2) : '0.00'}</td><td className="text-right">{e.credit ? e.credit.toFixed(2) : '0.00'}</td><td className="text-right">{e.balance ? e.balance.toFixed(2) : '0.00'}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-bold"><td colSpan={3}>Totals</td><td className="text-right">{statementData.totals.debit.toFixed(2)}</td><td className="text-right">{statementData.totals.credit.toFixed(2)}</td><td className="text-right">{statementData.totals.net.toFixed(2)}</td></tr>
                </tfoot>
              </table>
              </div>
                </div>
              )}
            </div>
          </div>
        )}

        {settlementCustomer && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 md:items-center md:p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="settlement-title"
              className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-h-[min(88dvh,760px)] md:rounded-3xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Customer settlement</p>
                  <h2 id="settlement-title" className="mt-1 break-words text-xl font-bold text-slate-900">{settlementCustomer.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">Current outstanding balance</p>
                </div>
                <button aria-label="Close settlement" onClick={() => setSettlementCustomer(null)} className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6">
                {settlementError && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{settlementError}</p>}

                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-800">Pending payment</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">₹{settlementCustomer.pending_amount}</p>
                  </div>
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-800">Pending jars</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-blue-950">{settlementCustomer.pending_jars}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <section className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold text-slate-900">Payment</h3>
                    <label className="block text-sm font-medium text-slate-700">
                      Payment status
                      <select value={settlementPaymentState} onChange={(e) => setSettlementPaymentState(e.target.value)} className="input mt-1.5">
                        <option value="pending">Partially / not received</option>
                        <option value="completed">Fully received</option>
                      </select>
                    </label>
                    {settlementPaymentState === "pending" && (
                      <label className="mt-3 block text-sm font-medium text-slate-700">
                        Received now
                        <input type="number" min="0" max={settlementCustomer.pending_amount} value={settlementReceived} onChange={(e) => setSettlementReceived(e.target.value)} className="input mt-1.5" placeholder="Enter amount" />
                      </label>
                    )}
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      Remaining: <strong className="text-slate-900">₹{Math.max(0, settlementCustomer.pending_amount - settlementPayment)}</strong>
                    </p>
                  </section>

                  <section className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="mb-3 font-semibold text-slate-900">Jar return</h3>
                    <label className="block text-sm font-medium text-slate-700">
                      Jar status
                      <select value={settlementJarState} onChange={(e) => setSettlementJarState(e.target.value)} className="input mt-1.5">
                        <option value="pending">Partially / not returned</option>
                        <option value="completed">All jars returned</option>
                      </select>
                    </label>
                    {settlementJarState === "pending" && (
                      <label className="mt-3 block text-sm font-medium text-slate-700">
                        Returned now (max {settlementCustomer.pending_jars})
                        <input type="number" min="0" max={settlementCustomer.pending_jars} value={settlementReturned} onChange={(e) => setSettlementReturned(e.target.value)} className="input mt-1.5" placeholder="Enter jar count" />
                      </label>
                    )}
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      Remaining: <strong className="text-slate-900">{Math.max(0, settlementCustomer.pending_jars - settlementJars)} jars</strong>
                    </p>
                  </section>
                </div>

                <p className="mt-4 text-sm text-slate-500">Selecting fully received/returned clears the full pending balance.</p>
              </div>

              <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
                <button disabled={settlementSaving} onClick={settleCustomer} className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {settlementSaving ? "Saving..." : "Update settlement"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
