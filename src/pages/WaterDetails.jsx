import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 md:p-6 w-full bg-gray-100 min-h-screen pb-20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Water Details 💧</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* SUMMARY */}
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
              ₹{pending}
            </p>
          </div>

        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-4 bg-blue-600 text-white p-3 rounded-xl text-sm font-semibold">
          <p>Order</p>
          <p>Delivery Boy</p>
          <p>Customer</p>
          <p className="text-right">Amount</p>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl shadow mt-2">

          {filteredData.length === 0 ? (
            <p className="p-4 text-center text-gray-400">
              No data found
            </p>
          ) : (
            filteredData.map((d, i) => (
              <div
                key={i}
                onClick={() => navigate(`/order/${d.id}`)} // 🔥 FIX
                className="grid grid-cols-4 p-3 border-b items-center cursor-pointer hover:bg-gray-50"
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

      </div>
    </div>
  );
}