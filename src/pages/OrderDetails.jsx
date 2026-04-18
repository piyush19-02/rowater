import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const found = deliveries.find((d) => String(d.id) === id);
    setOrder(found);
  }, [id]);

  if (!order) return <div className="p-5">Order not found</div>;

  const today = new Date().toISOString().split("T")[0];
  const isUpcoming = order.date > today;

  const pending = order.amount - (order.received || 0);

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleString();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 md:p-6 w-full bg-gray-100 min-h-screen pb-20">

        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6">

          {/* HEADER */}
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold">
              {isUpcoming ? "Upcoming Order" : "Order Details"}
            </h1>
            <p className="text-xs text-gray-500">
              {isUpcoming ? "Scheduled Delivery" : "Order Invoice"}
            </p>
          </div>

          {/* CUSTOMER */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">
                {order.customerName || "Guest"}
              </p>
              <p className="text-sm text-gray-500">
                📞 {order.mobile || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                📍 {order.address || "N/A"}
              </p>
            </div>

            {/* 🔥 STATUS */}
            <span
              className={`px-4 py-1 rounded-full text-sm ${
                isUpcoming
                  ? "bg-blue-100 text-blue-600"
                  : pending > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {isUpcoming ? "Upcoming" : pending > 0 ? "Pending" : "Paid"}
            </span>
          </div>

          {/* DATE */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <p>Delivery Date</p>
            <p className="text-right">{order.date}</p>

            {!isUpcoming && (
              <>
                <p>Requested At</p>
                <p className="text-right">
                  {formatTime(order.requestedAt || order.time)}
                </p>

                <p>Received At</p>
                <p className="text-right">
                  {formatTime(order.receivedAt)}
                </p>
              </>
            )}
          </div>

          {/* DELIVERY INFO */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">

            <p>Manager</p>
            <p className="text-right">
              {order.managerName || order.deliveryBoy || "Admin"}
            </p>

            <p>Driver</p>
            <p className="text-right">
              {order.driverName || "Piyush"}
            </p>

            <p>Method</p>
            <p className="text-right">
              {order.deliveryMethod === "self"
                ? "🚚 Self Delivery"
                : "🏪 Walk-in"}
            </p>

            {order.deliveryMethod === "self" && order.vehicleNo && (
              <>
                <p>Vehicle No</p>
                <p className="text-right">{order.vehicleNo}</p>
              </>
            )}
          </div>

          {/* ITEMS */}
          <div className="border-t border-b py-3 mb-4 text-sm">
            <div className="flex justify-between mb-1">
              <span>🧊 Jar ({order.jar || 0})</span>
              <span>₹{(order.jar || 0) * 60}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span>💧 Water ({order.liter || 0})</span>
              <span>₹{(order.liter || 0) * 2}</span>
            </div>

            <div className="flex justify-between">
              <span>Rate</span>
              <span>₹{order.rate || "Auto"}</span>
            </div>
          </div>

          {/* EXTRA */}
          {!isUpcoming && (
            <div className="text-sm mb-4 space-y-1">
              <div className="flex justify-between">
                <span>Extra Charges</span>
                <span>₹{order.extra || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Description</span>
                <span>{order.extraNote || "-"}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount || 0}</span>
              </div>
            </div>
          )}

          {/* TOTAL */}
          <div className="border-t pt-3 space-y-2">

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{order.amount}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Received</span>
              <span>₹{order.received || 0}</span>
            </div>

            {!isUpcoming && (
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Pending</span>
                <span>₹{pending}</span>
              </div>
            )}
          </div>

          {/* NOTES */}
          <div className="mt-4 border-t pt-3">
            <p className="text-sm font-semibold mb-1">Notes</p>
            <p className="text-sm text-gray-600">
              {order.notes || "-"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}