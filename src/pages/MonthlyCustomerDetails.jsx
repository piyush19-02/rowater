import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { customers, deliveries } from "../data/demoData";

export default function MonthlyCustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [rows, setRows] = useState([]);
  const [oldRows, setOldRows] = useState([]);
  const [showOld, setShowOld] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const cust = customers.find((c) => c.id == id);
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

      <div className="md:ml-60 p-4 w-full bg-gray-100 min-h-screen">

        {/* PROFILE */}
        <div className="bg-white p-5 rounded-xl shadow mb-4">
          <h2 className="font-bold text-lg">{customer?.name}</h2>

          <p className="text-sm text-gray-600">
            📞 {customer?.mobile}
          </p>

          <p className="text-sm text-gray-500">
            📍 {customer?.shop} - {customer?.address}
          </p>

          <div className="mt-3 border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Last Payment Date</span>
              <span>{lastPayment?.date || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Last Payment</span>
              <span className="text-blue-600">{daysAgo}</span>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-6 bg-gray-50 p-3 font-semibold text-sm">
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
              className="grid grid-cols-6 p-3 border-t text-sm cursor-pointer hover:bg-gray-100"
            >
              <p>{r.date}</p>
              <p>{r.manager}</p>
              {/* <p>{r.vehicle}</p> */}

              <p><span className="text-green-600 font-semibold">₹{r.received}</span> / <span className="font-semibold">  ₹{r.amount}</span></p>

              <p>{r.amount === 0 ? "0" : `₹${r.amount}`}</p>

              <p className={r.pending > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                ₹{r.pending}
              </p>
            </div>
          ))}

          {/* TOGGLE */}
          <div className="text-center p-3">
            <button
              onClick={() => setShowOld(!showOld)}
              className="text-blue-600 font-semibold"
            >
              {showOld ? "Hide Previous" : "Show Previous Month"}
            </button>
          </div>

          {showOld &&
            oldRows.map((r, i) => (
              <div key={i} className="grid grid-cols-6 p-3 border-t text-sm bg-gray-50">
                <p>{r.date}</p>
                <p>{r.manager}</p>
                {/* <p>{r.vehicle}</p> */}
                <p>₹{r.received} / ₹{r.amount}</p>
                <p>{r.amount === 0 ? "0" : `₹${r.amount}`}</p>
                <p className="text-gray-600">₹{r.pending}</p>
              </div>
            ))}
        </div>

        {/* 🔥 POPUP */}
        {selectedRow && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 shadow-lg">

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
                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}