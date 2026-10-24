import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function CustomerDetails() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [customer, setCustomer] = useState(null);

  const [total, setTotal] = useState(0);
  const [received, setReceived] = useState(0);

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const ledger = JSON.parse(localStorage.getItem("ledger")) || [];

    // ✅ customer detail
    const cust = customers.find((c) => c.id == id);
    setCustomer(cust);

    // ✅ delivery history
    const filtered = deliveries.filter((d) => d.customer_id == id);
    setData(filtered);

    // ✅ total calculation
    let totalAmt = 0;
    filtered.forEach(d => totalAmt += d.amount);

    // ✅ received calculation
    let rec = 0;
    ledger.forEach(l => {
      if (l.customer_id == id && l.type === "payment") {
        rec += l.amount;
      }
    });

    setTotal(totalAmt);
    setReceived(rec);

  }, [id]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">

        {/* 🔥 CUSTOMER PROFILE */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <p className="text-sm font-semibold text-blue-700">Customer account</p>
          <h1 className="mb-4 mt-1 text-2xl font-bold text-slate-900">Customer profile</h1>

          {customer ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-semibold">{customer.name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-semibold">{customer.mobile}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Address</p>
                <p className="font-semibold">{customer.address}</p>
              </div>

            </div>
          ) : (
            <p className="text-slate-500">Customer not found</p>
          )}

        </section>

        {/* 🔥 SUMMARY */}
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
              ₹{total - received}
            </p>
          </div>

        </div>

        {/* 🔥 HISTORY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="mb-4 text-lg font-bold text-slate-900">Delivery history</h2>

          {data.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
              No history found
            </p>
          ) : (
            data.map((d, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    Jar: {d.jar} | Return: {d.jar_return || 0}
                  </p>
                  <p className="text-xs text-slate-500">{d.date}</p>
                </div>

                <p className="font-bold text-blue-700">
                  ₹{d.amount}
                </p>
              </div>
            ))
          )}

        </section>

      </main>
    </div>
  );
}