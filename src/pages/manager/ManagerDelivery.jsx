import { useState, useEffect } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";
import { Copy, Plus, X } from "lucide-react";

export default function ManagerDelivery() {
  const { currentManager } = useManager();
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [guestForm, setGuestForm] = useState({
    customerName: "",
    mobile: "",
    jar: 0,
    liter: 0,
    amount: 0,
    received: 0,
    status: "pending",
  });

  useEffect(() => {
    loadTodayDeliveries();
  }, [currentManager?.id]);

  const loadTodayDeliveries = () => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const today = new Date().toISOString().split("T")[0];
    
    const todayOrders = deliveries.filter(d => {
      const date = d.requestedAt || d.date;
      const isToday = date && date.startsWith(today);
      const isManagerData = !d.managerId || d.managerId === currentManager?.id;
      return isToday && isManagerData;
    });

    setTodayDeliveries(todayOrders);
  };

  const handleCopyDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setGuestForm({
      customerName: "",
      mobile: "",
      jar: delivery.jar || 0,
      liter: delivery.liter || 0,
      amount: 0,
      received: 0,
      status: "pending",
    });
    setShowCopyModal(true);
  };

  const handleFormChange = (field, value) => {
    setGuestForm(prev => ({
      ...prev,
      [field]: field === "jar" || field === "liter" ? Number(value) : value
    }));
  };

  const calculateAmount = () => {
    const jar = Number(guestForm.jar || 0);
    const liter = Number(guestForm.liter || 0);
    return (jar * 60) + (liter * 2);
  };

  const handleSaveGuestDelivery = () => {
    if (!guestForm.customerName.trim() || !guestForm.mobile.trim()) {
      alert("Please enter customer name and mobile number");
      return;
    }

    const amount = calculateAmount();
    const received = guestForm.status === "paid" ? amount : 0;

    const newDelivery = {
      id: Date.now(),
      customerName: guestForm.customerName,
      mobile: guestForm.mobile,
      jar: Number(guestForm.jar || 0),
      liter: Number(guestForm.liter || 0),
      amount: amount,
      received: received,
      status: guestForm.status,
      isGuest: true,
      managerId: currentManager?.id,
      requestedAt: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
    };

    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    localStorage.setItem("deliveries", JSON.stringify([...deliveries, newDelivery]));

    setGuestForm({
      customerName: "",
      mobile: "",
      jar: 0,
      liter: 0,
      amount: 0,
      received: 0,
      status: "pending",
    });
    setShowCopyModal(false);
    setSelectedDelivery(null);
    loadTodayDeliveries();
  };

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Today's Deliveries</h1>
          <button
            onClick={() => {
              setSelectedDelivery(null);
              setGuestForm({
                customerName: "",
                mobile: "",
                jar: 0,
                liter: 0,
                amount: 0,
                received: 0,
                status: "pending",
              });
              setShowCopyModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Guest Delivery
          </button>
        </div>

        {/* DELIVERIES LIST */}
        <div className="bg-white rounded-2xl shadow p-6">
          {todayDeliveries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Mobile</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Jar</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Water (L)</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Received</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayDeliveries.map((delivery, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {delivery.customerName || "N/A"}
                        {delivery.isGuest && <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Guest</span>}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">{delivery.mobile || "-"}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{delivery.jar || "-"}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{delivery.liter || "-"}</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-semibold">₹{delivery.amount || 0}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-semibold">₹{delivery.received || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          delivery.status === "paid" || Number(delivery.received || 0) >= Number(delivery.amount || 0)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {delivery.status === "paid" || Number(delivery.received || 0) >= Number(delivery.amount || 0) ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleCopyDelivery(delivery)}
                          className="flex items-center justify-center gap-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
                          title="Copy this delivery to guest customer"
                        >
                          <Copy size={16} />
                          <span className="text-xs">Copy</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No deliveries for today</p>
            </div>
          )}
        </div>

        {/* COPY MODAL */}
        {showCopyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {selectedDelivery ? "Copy Guest Delivery" : "Add Guest Delivery"}
                </h2>
                <button
                  onClick={() => {
                    setShowCopyModal(false);
                    setSelectedDelivery(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              {selectedDelivery && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
                  <p className="text-slate-600">Copying from: <span className="font-semibold">{selectedDelivery.customerName}</span></p>
                  <p className="text-slate-600">Jar: <span className="font-semibold">{selectedDelivery.jar}</span> | Water: <span className="font-semibold">{selectedDelivery.liter}L</span></p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter guest customer name"
                    value={guestForm.customerName}
                    onChange={(e) => handleFormChange("customerName", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={guestForm.mobile}
                    onChange={(e) => handleFormChange("mobile", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Jar
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={guestForm.jar}
                      onChange={(e) => handleFormChange("jar", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Water (L)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={guestForm.liter}
                      onChange={(e) => handleFormChange("liter", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={guestForm.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-600">
                    Amount: <span className="font-bold text-lg text-slate-900">₹{calculateAmount()}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowCopyModal(false);
                      setSelectedDelivery(null);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGuestDelivery}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                  >
                    Save Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
