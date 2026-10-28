import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const found = deliveries.find((d) => String(d.id) === id);
    setOrder(found);
  }, [id]);

  if (!order) return   <div className="min-h-screen bg-slate-100 p-5 text-slate-600">Order not found</div>;

  const today = new Date().toISOString().split("T")[0];
  const isUpcoming = order.date > today;

  const pending = order.amount - (order.received || 0);

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleString();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-h-screen w-full min-w-0 p-4 pb-24 sm:p-6 md:ml-60 md:p-8">

        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {/* HEADER */}
          <div className="mb-5 border-b border-slate-100 pb-4 text-center">
            <p className="text-sm font-semibold text-blue-700">Order information</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {isUpcoming ? "Upcoming Order" : "Order Details"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isUpcoming ? "Scheduled Delivery" : "Order Invoice"}
            </p>
          </div>

          {/* CUSTOMER */}
          <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-lg text-slate-900">
                {order.customerName || "Guest"}
              </p>
              <p className="text-sm text-slate-500">
                📞 {order.mobile || "N/A"}
              </p>
              <p className="break-words text-sm text-slate-500">
                📍 {order.address || "N/A"}
              </p>
            </div>

            {/* 🔥 STATUS */}
            <span
              className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
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
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm">
            <p>Delivery Date</p>
            <p className="text-right font-medium text-slate-800">{order.date}</p>

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
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm">

            <p>Manager</p>
            <p className="text-right font-medium text-slate-800">
              {order.managerName || order.deliveryBoy || "Admin"}
            </p>

            <p>Driver</p>
            <p className="text-right font-medium text-slate-800">
              {order.driverName || "Piyush"}
            </p>

            <p>Method</p>
            <p className="text-right font-medium text-slate-800">
              {order.deliveryMethod === "self"
                ? "🚚 Self Delivery"
                : "🏪 Walk-in"}
            </p>

            {order.deliveryMethod === "self" && order.vehicleNo && (
              <>
                <p>Vehicle No</p>
                <p className="text-right font-medium text-slate-800">{order.vehicleNo}</p>
              </>
            )}
          </div>

          {/* ITEMS */}
          <div className="mb-5 border-y border-slate-100 py-4 text-sm">
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
          <div className="mb-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Extra Charges</span>
              <span>₹{order.extraCharge ?? order.extra ?? 0}</span>
            </div>

            <div className="flex justify-between">
              <span>Description</span>
              <span>{order.notes || order.extraNote || "-"}</span>
            </div>

            <div className="flex justify-between text-emerald-700">
              <span>Discount</span>
              <span>-₹{order.discount || 0}</span>
            </div>
          </div>

          {/* TOTAL */}
          <div className="space-y-2 border-t border-slate-100 pt-4">

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{order.amount}</span>
            </div>

            <div className="flex justify-between text-emerald-700">
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
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-1 text-sm font-semibold text-slate-900">Notes</p>
            <p className="break-words text-sm text-slate-600">
              {order.notes || "-"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}