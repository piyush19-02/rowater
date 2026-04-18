import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function UpcomingOrders() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    const today = new Date().toISOString().split("T")[0];

    const upcoming = deliveries
      .filter((d) => d.date > today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((d, i) => ({
        ...d,
        orderNo: i + 1,
      }));

    setData(upcoming);
  }, []);

  return (
    <div className="flex">
      {/* <Sidebar /> */}

      <div className=" p-4 w-full bg-gray-100 min-h-screen">

        <h2 className="text-xl font-bold mb-4">
          Upcoming Orders 📅
        </h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-4 bg-gray-50 p-3 font-semibold text-sm">
            <p>Order / Client</p>
            <p>Manager / Date</p>
            <p>Type</p>
            <p className="text-right">Received / Total</p>
          </div>

          {data.length === 0 ? (
            <p className="p-4 text-center text-gray-400">
              No upcoming orders
            </p>
          ) : (
            data.map((d) => {
              const received = Number(d.received || 0);

              return (
                <div
                  key={d.orderNo}
                  onClick={() => navigate(`/order/${d.id}`)}
                  className="grid grid-cols-4 p-3 border-t text-sm items-center hover:bg-blue-50 cursor-pointer"
                >
                  {/* Order + Client */}
                  <div>
                    <p className="font-semibold">#{d.orderNo}</p>
                    <p className="text-xs text-gray-500">
                      {d.customerName || "Guest"}
                    </p>
                  </div>

                  {/* Manager + Date */}
                  <div>
                    <p className="font-medium">
                      {d.deliveryBoy || "Piyush"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {d.date}
                    </p>
                  </div>

                  {/* TYPE */}
                  <div>
                    {d.jar > 0 && "🧊 Jar "}
                    {d.liter > 0 && "💧 Water"}
                  </div>

                  {/* RECEIVED / TOTAL */}
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ₹{received}
                    </p>
                    <p className="text-xs text-gray-400">
                      / ₹{d.amount}
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}