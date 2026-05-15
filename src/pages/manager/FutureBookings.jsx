import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";
import { upcomingOrders } from "../../data/upcomingData";

export default function FutureBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(upcomingOrders);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentReceived, setPaymentReceived] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [deliveryMethod, setDeliveryMethod] = useState("");

  const futureBookings = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(booking => booking.date >= today);
  }, [bookings]);

  const openDeliverModal = (booking) => {
    setSelectedBooking(booking);
    setPaymentReceived(booking.received || "");
    setPaymentStatus(booking.received >= booking.amount ? "paid" : "pending");
    setDeliveryMethod(booking.deliveryMethod || "");
    setShowModal(true);
  };

  const handleDeliver = () => {
    if (selectedBooking) {
      const updatedReceived = Number(paymentReceived) || 0;
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { 
              ...booking, 
              received: updatedReceived, 
              deliveryMethod: deliveryMethod,
              paymentStatus: paymentStatus
            } 
          : booking
      ));
      setShowModal(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Future Pending Bookings</h1>
              <p className="mt-2 text-slate-600">Here are upcoming bookings that are still pending delivery.</p>
            </div>
            <button
              onClick={() => navigate("/manager")}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-4 py-3 border">Date</th>
                  <th className="px-4 py-3 border">Customer</th>
                  <th className="px-4 py-3 border">Mobile</th>
                  <th className="px-4 py-3 border">Address</th>
                  <th className="px-4 py-3 border">Jar</th>
                  <th className="px-4 py-3 border">Liter</th>
                  <th className="px-4 py-3 border">Amount</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {futureBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border">{booking.date}</td>
                    <td className="px-4 py-3 border">{booking.customerName}</td>
                    <td className="px-4 py-3 border">{booking.mobile || "-"}</td>
                    <td className="px-4 py-3 border">{booking.address || "-"}</td>
                    <td className="px-4 py-3 border">{booking.jar || 0}</td>
                    <td className="px-4 py-3 border">{booking.liter || 0}</td>
                    <td className="px-4 py-3 border">₹{booking.amount}</td>
                    <td className="px-4 py-3 border">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        booking.received >= booking.amount 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {booking.received >= booking.amount ? "Delivered" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border">
                      {booking.received < booking.amount && booking.date <= new Date().toISOString().split("T")[0] && (
                        <button
                          onClick={() => openDeliverModal(booking)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Deliver Booking</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Received (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentReceived}
                    onChange={(e) => setPaymentReceived(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount received"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Delivery Method
                  </label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select method</option>
                    <option value="self">Self Pickup</option>
                    <option value="walkin">Walk-in</option>
                    <option value="delivery">Home Delivery</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDeliver}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Confirm Delivery
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
