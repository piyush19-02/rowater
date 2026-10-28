import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function WaterDetails() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    // 🔥 water detect (better method)
    const water = deliveries.filter(d => (d.liter || 0) > 0);

    setData(water);
  }, []);

  const total = data.reduce((t, d) => t + d.amount, 0);
  const received = data.reduce((t, d) => t + (d.received || 0), 0);
  const pending = total - received;

  const filteredData =
    filter === "pending"
      ? data.filter(d => (d.amount - (d.received || 0)) > 0)
      : data;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">

        {/* HEADER */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Admin overview</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Water details</h1>
            <p className="mt-1 text-sm text-slate-500">Review water sales and outstanding balances.</p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-full sm:w-44"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
          </select>
        </header>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-xl font-bold text-blue-700">
              ₹{total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Received</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              ₹{received}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-1 text-xl font-bold text-red-700">
              ₹{pending}
            </p>
          </div>

        </div>

        {/* TABLE HEADER */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="grid min-w-[600px] grid-cols-4 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
              <p>Order</p>
              <p>Delivery Boy</p>
              <p>Customer</p>
              <p className="text-right">Amount</p>
            </div>

          {filteredData.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No data found
            </p>
          ) : (
            filteredData.map((d, i) => (
              <div
                key={i}
                onClick={() => navigate(`/order/${d.id}`)} // 🔥 FIX
                className="grid min-w-[600px] grid-cols-4 items-center border-t border-slate-100 p-4 text-sm text-slate-700 transition hover:bg-blue-50"
              >
                <p>#{i + 1}</p>

                <p>{d.deliveryBoy || "—"}</p>

                <p className="truncate">{d.customerName}</p>

                <p className="text-right font-semibold">
                  ₹{d.amount}
                </p>
              </div>
            ))
          )}

          </div>
        </section>

      </main>
    </div>
  );
}