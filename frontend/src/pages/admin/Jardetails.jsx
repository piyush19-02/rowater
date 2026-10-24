import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function JarDetails() {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    loadData("date");
  }, []);

  const loadData = (type) => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    // 🔥 TODAY DATE
    const today = new Date().toISOString().split("T")[0];

    let filtered = deliveries
      .filter((d) => {
        let date = null;

        if (d.date) {
          date = d.date;
        } else if (d.requestedAt) {
          date = d.requestedAt.split("T")[0];
        }

        const jar = d.jar ?? 0;

        return date === today && jar > 0;
      })
      .map((d, index) => {
        const amount = Number(d.amount || 0);
        const received = Number(d.received || 0);

        return {
          ...d,
          orderNo: index + 1,
          deliveryBoy: d.deliveryBoy || d.driverName || "Piyush",
          amount,
          received,
          pending: amount - received,
        };
      });

    // 🔥 SORT
    if (type === "pending") {
      filtered.sort((a, b) => b.pending - a.pending);
    }

    setData(filtered);
  };

  const handleSort = (type) => {
    setSortType(type);
    loadData(type);
  };

  // 🔥 TOTALS
  const total = data.reduce((t, d) => t + d.amount, 0);
  const received = data.reduce((t, d) => t + d.received, 0);
  const pending = total - received;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">

        {/* HEADER */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Admin overview</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Today’s jar sales</h1>
            <p className="mt-1 text-sm text-slate-500">Track today’s jar deliveries and payments.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort("date")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                sortType === "date"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              Date
            </button>

            <button
              onClick={() => handleSort("pending")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                sortType === "pending"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* TOTAL CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-xl font-bold text-blue-700">₹{total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Received</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">₹{received}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-1 text-xl font-bold text-red-700">₹{pending}</p>
          </div>
        </div>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">

          <div className="grid min-w-[720px] grid-cols-5 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
            <p>Order</p>
            <p>Manager</p>
            <p>Client</p>
            <p>Received / Total</p>
            <p>Pending</p>
          </div>

          {data.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No data found
            </p>
          ) : (
            data.map((d) => (
              <div
                key={d.orderNo}
                onClick={() => navigate(`/order/${d.id}`)}
                className="grid min-w-[720px] grid-cols-5 items-center border-t border-slate-100 p-4 text-slate-700 transition hover:bg-blue-50"
              >
                <p className="font-semibold">#{d.orderNo}</p>

                <p className="text-sm text-gray-600">
                  {d.deliveryBoy}
                </p>

                <p className="font-medium">
                  {d.customerName || (d.customer_id ? "Customer" : "Guest")}
                </p>

                <div>
                  <span className="text-green-600 font-semibold">
                    ₹{d.received}
                  </span>
                  <span className="text-gray-400">
                    {" / "}₹{d.amount}
                  </span>
                </div>

                <p className="text-red-600 font-semibold">
                  ₹{d.pending}
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