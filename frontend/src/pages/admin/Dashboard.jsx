import { useEffect, useState } from "react";
import { MessageCircle, ReceiptText } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function Dashboard() {
  const [tab, setTab] = useState("retail");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/monthly")
      .then((result) => setData(result.data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const dueCustomers = data?.monthly_due_customers || [];
  const expenses = data?.expenses || [];
  const grouped = expenses.reduce((all, item) => ({
    ...all,
    [item.category_name]: [...(all[item.category_name] || []), item],
  }), {});

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">
        <header className="mb-6">
          <p className="text-sm font-semibold text-blue-700">Admin dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{data?.month || "Monthly overview"}</h1>
          <p className="mt-1 text-sm text-slate-500">A quick view of outstanding balances, monthly dues, and expenses.</p>
        </header>

        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Card label="Total pending" value={data?.total_pending} color="red" />
          <Card label="Monthly revenue" value={data?.revenue} color="green" />
          <Card label="Daily / monthly due" value={data?.daily_monthly_pending} color="amber" />
          <Card label="Party order due" value={data?.party_pending} color="blue" />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Dashboard sections">
          <Tab text="Retail" active={tab === "retail"} onClick={() => setTab("retail")} />
          <Tab text="Monthly dues" active={tab === "monthly"} onClick={() => setTab("monthly")} />
          <Tab text="Expenses" active={tab === "expense"} onClick={() => setTab("expense")} />
        </div>

        {tab === "retail" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Pending breakdown</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Daily / Monthly <strong className="mt-1 block text-lg text-slate-900">₹{data?.daily_monthly_pending || 0}</strong>
              </p>
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Party orders <strong className="mt-1 block text-lg text-slate-900">₹{data?.party_pending || 0}</strong>
              </p>
            </div>
          </section>
        )}

        {tab === "monthly" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Top monthly due customers</h2>
            {dueCustomers.length ? dueCustomers.map((customer) => {
              const message = encodeURIComponent(`Namaste ${customer.name}, aapka RO Water ka pending amount ₹${customer.pending_amount} hai. Kripya payment kar dein.`);
              return (
                <article key={customer.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="mt-1 break-words text-sm text-slate-500">{customer.address} · ₹{customer.pending_amount} pending</p>
                  </div>
                  <a href={`https://wa.me/91${customer.mobile}?text=${message}`} target="_blank" rel="noreferrer" aria-label={`Message ${customer.name} on WhatsApp`} className="shrink-0 rounded-full bg-emerald-50 p-3 text-emerald-700 hover:bg-emerald-100">
                    <MessageCircle size={20} />
                  </a>
                </article>
              );
            }) : <Empty text="No monthly pending customer." />}
          </section>
        )}

        {tab === "expense" && (
          <section className="space-y-4">
            {Object.keys(grouped).length ? Object.entries(grouped).map(([category, entries]) => (
              <div key={category} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                  <ReceiptText size={18} className="text-red-600" />{category}
                </h2>
                {entries.map((expense, index) => (
                  <div key={`${expense.expense_date}-${index}`} className="flex flex-col gap-1 border-t border-slate-100 py-3 text-sm sm:flex-row sm:justify-between">
                    <span className="text-slate-600">{expense.expense_date} · {expense.description || "-"}</span>
                    <b className="text-slate-900">₹{expense.amount}</b>
                  </div>
                ))}
              </div>
            )) : <Empty text="No expense this month." />}
          </section>
        )}
      </main>
    </div>
  );
}

function Card({ label, value, color }) {
  const colors = {
    red: "border-l-red-500",
    green: "border-l-emerald-500",
    amber: "border-l-amber-500",
    blue: "border-l-blue-500",
  };

  return (
    <div className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${colors[color]}`}>
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">₹{Number(value || 0).toLocaleString("en-IN")}</p>
    </div>
  );
}

function Tab({ text, active, onClick }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
      {text}
    </button>
  );
}

function Empty({ text }) {
  return <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">{text}</p>;
}
