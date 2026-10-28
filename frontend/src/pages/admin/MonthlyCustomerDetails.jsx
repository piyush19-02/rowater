import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { monthlyCustomers, deliveries } from "../../data/demoData";

export default function MonthlyCustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [rows, setRows] = useState([]);
  const [oldRows, setOldRows] = useState([]);
  const [showOld, setShowOld] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const cust = monthlyCustomers.find((c) => c.id == id);
    setCustomer(cust);

    const today = new Date();

    // 🔥 DATE GENERATOR
    const generateDates = (offset = 0) => {
      const arr = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - (i + offset));
        arr.push(d.toISOString().split("T")[0]);
      }
      return arr;
    };

    const currentDates = generateDates(0);
    const previousDates = generateDates(30);

    // 🔥 GROUP DATA
    const map = {};

    deliveries.forEach((d) => {
      if (d.customer_id == id) {
        if (!map[d.date]) {
          map[d.date] = {
            amount: 0,
            received: 0,
            manager: d.deliveryBoy,
            vehicle: d.vehicle,
          };
        }

        map[d.date].amount += Number(d.amount || 0);
        map[d.date].received += Number(d.received || 0);
      }
    });

    // 🔥 BUILD ROWS (correct ledger logic)
    const buildRows = (dates, start = 0) => {
      let running = start;
      const temp = [];

      // OLD → NEW calculation
      dates.forEach((date) => {
        const day = map[date] || {
          amount: 0,
          received: 0,
          manager: "-",
          vehicle: "-",
        };

        running = running + day.amount - day.received;

        temp.push({
          date,
          manager: day.manager,
          vehicle: day.vehicle,
          amount: day.amount,
          received: day.received,
          pending: running,
        });
      });

      return temp.reverse(); // latest ऊपर
    };

    const currentRows = buildRows(currentDates);

    // 🔥 IMPORTANT FIX (last day balance)
    const lastBalance =
      currentRows.length > 0
        ? currentRows[currentRows.length - 1].pending
        : 0;

    const prevRows = buildRows(previousDates, lastBalance);

    setRows(currentRows);
    setOldRows(prevRows);

    // 🔥 LAST PAYMENT
    let lastPay = null;

    deliveries.forEach((d) => {
      if (d.customer_id == id && d.received > 0) {
        if (!lastPay || new Date(d.date) > new Date(lastPay.date)) {
          lastPay = d;
        }
      }
    });

    setLastPayment(lastPay);
  }, [id]);

  // 🔥 DAYS AGO
  const today = new Date();
  let daysAgo = "-";

  if (lastPayment) {
    const diff = Math.floor(
      (today - new Date(lastPayment.date)) / (1000 * 60 * 60 * 24)
    );
    daysAgo = `${diff} days ago`;
    if (diff === 0) {
    daysAgo = "Today";
  } else if (diff === 1) {
    daysAgo = "1 day ago";
  } else {
    daysAgo = `${diff} days ago`;
  }
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">

        {/* PROFILE */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-blue-700">Monthly customer account</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{customer?.name || "Customer details"}</h1>

          <p className="mt-2 text-sm text-slate-600">
            📞 {customer?.mobile}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            📍 {customer?.shop} - {customer?.address}
          </p>

          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Last payment date</span>
              <span className="font-medium">{lastPayment?.date || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Last payment</span>
              <span className="font-medium text-blue-700">{daysAgo}</span>
            </div>
          </div>
        </section>

        <header className="mb-3">
          <h2 className="text-lg font-bold text-slate-900">Account ledger</h2>
          <p className="mt-1 text-sm text-slate-500">Daily deliveries, payments, and running balance.</p>
        </header>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">

          <div className="grid min-w-[720px] grid-cols-5 bg-slate-50 p-3 text-sm font-semibold text-slate-600">
            <p>Date</p>
            <p>Manager</p>
            {/* <p>Vehicle</p> */}
            <p>Received / Total</p>
            <p>Amount</p>
            <p>Pending</p>
          </div>

          {rows.map((r, i) => (
            <div
              key={i}
              onClick={() => setSelectedRow(r)}
              className="grid min-w-[720px] grid-cols-5 cursor-pointer border-t border-slate-100 p-3 text-sm text-slate-700 hover:bg-blue-50"
            >
              <p>{r.date}</p>
              <p>{r.manager}</p>
              {/* <p>{r.vehicle}</p> */}

              <p><span className="font-semibold text-emerald-700">₹{r.received}</span> / <span className="font-semibold">₹{r.amount}</span></p>

              <p>{r.amount === 0 ? "0" : `₹${r.amount}`}</p>

              <p className={r.pending > 0 ? "font-semibold text-red-700" : "font-semibold text-emerald-700"}>
                ₹{r.pending}
              </p>
            </div>
          ))}

          {/* TOGGLE */}
          <div className="min-w-[720px] border-t border-slate-100 p-3 text-center">
            <button
              onClick={() => setShowOld(!showOld)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              {showOld ? "Hide Previous" : "Show Previous Month"}
            </button>
          </div>

          {showOld &&
            oldRows.map((r, i) => (
              <div key={i} className="grid min-w-[720px] grid-cols-5 border-t border-slate-100 bg-slate-50 p-3 text-sm">
                <p>{r.date}</p>
                <p>{r.manager}</p>
                {/* <p>{r.vehicle}</p> */}
                <p>₹{r.received} / ₹{r.amount}</p>
                <p>{r.amount === 0 ? "0" : `₹${r.amount}`}</p>
                <p className="text-gray-600">₹{r.pending}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔥 POPUP */}
        {selectedRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">

              <h2 className="text-lg font-bold mb-3">Order Detail</h2>

              <div className="space-y-2 text-sm">
                <p><b>Date:</b> {selectedRow.date}</p>
                <p><b>Manager:</b> {selectedRow.manager}</p>
                {/* <p><b>Vehicle:</b> {selectedRow.vehicle}</p> */}
                <p><b>Total Amount:</b> ₹{selectedRow.amount}</p>
                <p><b>Received:</b> ₹{selectedRow.received}</p>
                <p><b>Pending:</b> ₹{selectedRow.pending}</p>
              </div>

              <button
                onClick={() => setSelectedRow(null)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}