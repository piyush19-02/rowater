import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";

const getToday = () => new Date().toISOString().split("T")[0];

export default function GuestOrder() {
  const { currentManager } = useManager();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [guestOrders, setGuestOrders] = useState([]);
  const [guestForm, setGuestForm] = useState({
    customerName: "Guest",
    jar: "",
    liter: "",
    amount: "",
    received: "",
    vehicle: "",
    driver: "",
    status: "pending",
  });

  const loadGuestOrders = () => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const today = getToday();

    const orders = deliveries.filter((d) => {
      const isGuest = d.isGuest || d.customerName === "Guest" || d.orderType === "guest";
      const isToday = (d.date || d.requestedAt || "").startsWith(today);
      const isManager = !d.managerId || d.managerId === currentManager?.id;
      return isGuest && isToday && isManager;
    });

    setGuestOrders(orders.reverse());
  };

  useEffect(() => {
    loadGuestOrders();
  }, [currentManager?.id]);

  const handleFormChange = (field, value) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
  };

  const computedAmount = Number(guestForm.amount || 0) || (Number(guestForm.jar || 0) * 60 + Number(guestForm.liter || 0) * 2);
  const computedReceived = Number(guestForm.received || 0);
  const computedPending = Math.max(computedAmount - computedReceived, 0);

  const saveGuestOrder = () => {
    const jar = Number(guestForm.jar || 0);
    const liter = Number(guestForm.liter || 0);
    const amount = computedAmount;
    const received = computedReceived;

    if (!guestForm.customerName.trim()) {
      alert("Enter guest name.");
      return;
    }

    if (jar === 0 && liter === 0) {
      alert("Enter jar or liter quantity.");
      return;
    }

    const status = guestForm.status === "paid" || received >= amount ? "paid" : "pending";

    const newOrder = {
      id: Date.now(),
      customerName: guestForm.customerName.trim(),
      jar,
      liter,
      amount,
      received,
      pending: Math.max(amount - received, 0),
      vehicle: guestForm.vehicle.trim(),
      driver: guestForm.driver.trim(),
      status,
      isGuest: true,
      orderType: "guest",
      managerId: currentManager?.id,
      date: getToday(),
      time: new Date().toLocaleTimeString(),
    };

    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    localStorage.setItem("deliveries", JSON.stringify([newOrder, ...deliveries]));
    setGuestForm({ customerName: "Guest", jar: "", liter: "", amount: "", received: "", vehicle: "", driver: "", status: "pending" });
    loadGuestOrders();
    setActiveTab("details");
  };

  const markDelivered = (orderId) => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const updated = deliveries.map((item) => {
      if (item.id === orderId) {
        const amount = Number(item.amount || 0);
        return {
          ...item,
          received: amount,
          pending: 0,
          status: "paid",
        };
      }
      return item;
    });
    localStorage.setItem("deliveries", JSON.stringify(updated));
    loadGuestOrders();
  };

  const { pendingOrders, deliveredOrders } = useMemo(() => {
    const delivered = [];
    const pending = [];

    guestOrders.forEach((order) => {
      const isDelivered = order.status === "paid" || Number(order.received || 0) >= Number(order.amount || 0);
      if (isDelivered) {
        delivered.push(order);
      } else {
        pending.push(order);
      }
    });

    return { pendingOrders: pending, deliveredOrders: delivered };
  }, [guestOrders]);

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Guest Order Management</h1>
            <p className="text-sm text-slate-500 mt-1">Add guest orders and review delivered guest orders in separate tabs.</p>
          </div>
          <button
            onClick={() => navigate("/manager")}
            className="rounded-3xl bg-slate-900 text-white px-5 py-3 font-semibold hover:bg-slate-800 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              className={`px-4 py-3 rounded-3xl font-semibold ${activeTab === "details" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setActiveTab("details")}
            >
              Order Details
            </button>
            <button
              className={`px-4 py-3 rounded-3xl font-semibold ${activeTab === "delivered" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setActiveTab("delivered")}
            >
              Delivered ({deliveredOrders.length})
            </button>
          </div>
        </div>

        {activeTab === "details" ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">New Guest Order</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    value={guestForm.customerName}
                    onChange={(e) => handleFormChange("customerName", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Guest"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jar Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={guestForm.jar}
                    onChange={(e) => handleFormChange("jar", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Water (L)</label>
                  <input
                    type="number"
                    min="0"
                    value={guestForm.liter}
                    onChange={(e) => handleFormChange("liter", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={guestForm.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Auto compute if left empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Received</label>
                  <input
                    type="number"
                    min="0"
                    value={guestForm.received}
                    onChange={(e) => handleFormChange("received", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Status</label>
                  <select
                    value={guestForm.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle No.</label>
                  <input
                    value={guestForm.vehicle}
                    onChange={(e) => handleFormChange("vehicle", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Vehicle No."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name</label>
                  <input
                    value={guestForm.driver}
                    onChange={(e) => handleFormChange("driver", e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="Driver Name"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Computed Amount</p>
                  <p className="text-2xl font-semibold">₹{computedAmount}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Received</p>
                  <p className="text-2xl font-semibold">₹{computedReceived}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-semibold">₹{computedPending}</p>
                </div>
              </div>

              <button
                onClick={saveGuestOrder}
                className="mt-6 w-full rounded-3xl bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition"
              >
                Save Guest Order
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Guest Order Details</h2>
              {pendingOrders.length === 0 ? (
                <p className="text-slate-500">No guest orders in detail view.</p>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-3xl p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <p className="font-semibold">{order.customerName || "Guest"}</p>
                          <p className="text-sm text-slate-500">{order.date} • {order.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Status</p>
                          <p className="font-semibold text-orange-600">{order.status === "paid" ? "Paid" : "Pending"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-slate-700">
                        <div>Jar: {order.jar}</div>
                        <div>Water: {order.liter}L</div>
                        <div>Amount: ₹{order.amount}</div>
                        <div>Received: ₹{order.received}</div>
                        <div>Pending: ₹{Math.max(Number(order.amount || 0) - Number(order.received || 0), 0)}</div>
                        <div>Vehicle: {order.vehicle || "-"}</div>
                        <div>Driver: {order.driver || "-"}</div>
                      </div>
                      <button
                        onClick={() => markDelivered(order.id)}
                        className="mt-4 rounded-3xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Delivered Guest Orders</h2>
            {deliveredOrders.length === 0 ? (
              <p className="text-slate-500">No guest orders delivered yet.</p>
            ) : (
              <div className="space-y-4">
                {deliveredOrders.map((order) => (
                  <div key={order.id} className="border rounded-3xl p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-semibold">{order.customerName || "Guest"}</p>
                        <p className="text-sm text-slate-500">{order.date} • {order.time}</p>
                      </div>
                      <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">Delivered</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-slate-700">
                      <div>Jar: {order.jar}</div>
                      <div>Water: {order.liter}L</div>
                      <div>Amount: ₹{order.amount}</div>
                      <div>Received: ₹{order.received}</div>
                      <div>Vehicle: {order.vehicle || "-"}</div>
                      <div>Driver: {order.driver || "-"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
