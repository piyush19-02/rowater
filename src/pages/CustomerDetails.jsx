import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

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
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 md:p-6 w-full bg-gray-100 min-h-screen pb-20">

        {/* 🔥 CUSTOMER PROFILE */}
        <div className="bg-white p-6 rounded-2xl shadow mb-5">

          <h2 className="text-xl font-semibold mb-4">
            Customer Profile 👤
          </h2>

          {customer ? (
            <div className="grid md:grid-cols-3 gap-4">

              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="font-semibold">{customer.name}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Mobile</p>
                <p className="font-semibold">{customer.mobile}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="font-semibold">{customer.address}</p>
              </div>

            </div>
          ) : (
            <p className="text-gray-400">Customer not found</p>
          )}

        </div>

        {/* 🔥 SUMMARY */}
        <div className="grid grid-cols-3 gap-4 mb-5 text-center">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{total}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-400">Received</p>
            <p className="text-xl font-bold text-green-600">
              ₹{received}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-xl font-bold text-red-600">
              ₹{total - received}
            </p>
          </div>

        </div>

        {/* 🔥 HISTORY */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-4">
            Delivery History 📦
          </h2>

          {data.length === 0 ? (
            <p className="text-gray-400 text-center">
              No history found
            </p>
          ) : (
            data.map((d, i) => (
              <div
                key={i}
                className="border-b py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    Jar: {d.jar} | Return: {d.jar_return || 0}
                  </p>
                  <p className="text-xs text-gray-500">{d.date}</p>
                </div>

                <p className="font-bold text-blue-600">
                  ₹{d.amount}
                </p>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}