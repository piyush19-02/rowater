import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function AddUpcomingOrder() {
  const [customers, setCustomers] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestMobile, setGuestMobile] = useState("");

  const [jar, setJar] = useState(0);
  const [liter, setLiter] = useState(0);

  const [date, setDate] = useState("");
  const [deliveryBoy, setDeliveryBoy] = useState("Piyush");

  const [received, setReceived] = useState(0); // 🔥 advance

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(data);
  }, []);

  const handleSave = () => {
    if (!date) return alert("Select date");

    const today = new Date().toISOString().split("T")[0];
    if (date <= today) return alert("Only future date allowed");

    if (!isGuest && !customer) return alert("Select customer");
    if (isGuest && !guestName) return alert("Enter guest name");

    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    const amount = jar * 60 + liter * 2;

    const newOrder = {
      id: Date.now(),

      customer_id: customer?.id || null,
      customerName: isGuest ? guestName : customer?.name,
      mobile: isGuest ? guestMobile : customer?.mobile,

      jar,
      liter,

      amount,
      received: Number(received), // 🔥 advance added

      date,
      time: "Upcoming",

      deliveryBoy,
    };

    localStorage.setItem(
      "deliveries",
      JSON.stringify([...deliveries, newOrder])
    );

    // navigate("/upcoming");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 w-full bg-gray-100 min-h-screen">

        <h2 className="text-xl font-bold mb-4">
          Add Upcoming Order 📅
        </h2>

        <div className="bg-white p-5 rounded-xl shadow max-w-xl space-y-4">

          {/* TYPE */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsGuest(false)}
              className={`px-3 py-1 rounded ${
                !isGuest ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => setIsGuest(true)}
              className={`px-3 py-1 rounded ${
                isGuest ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Guest
            </button>
          </div>

          {/* CUSTOMER */}
          {!isGuest && (
            <select
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setCustomer(
                  customers.find((c) => c.id == e.target.value)
                )
              }
            >
              <option>Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile})
                </option>
              ))}
            </select>
          )}

          {/* GUEST */}
          {isGuest && (
            <>
              <input
                placeholder="Guest Name"
                className="border p-2 w-full rounded"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <input
                placeholder="Mobile"
                className="border p-2 w-full rounded"
                value={guestMobile}
                onChange={(e) => setGuestMobile(e.target.value)}
              />
            </>
          )}

          {/* ITEMS */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Jar"
              className="border p-2 rounded"
              value={jar}
              onChange={(e) => setJar(e.target.value)}
            />
            <input
              type="number"
              placeholder="Water (Liter)"
              className="border p-2 rounded"
              value={liter}
              onChange={(e) => setLiter(e.target.value)}
            />
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-500">
              Delivery Date
            </label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* MANAGER */}
          <input
            placeholder="Delivery Boy"
            className="border p-2 w-full rounded"
            value={deliveryBoy}
            onChange={(e) => setDeliveryBoy(e.target.value)}
          />

          {/* 🔥 ADVANCE */}
          <div>
            <label className="text-sm text-gray-500">
              Advance (Received)
            </label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
            />
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Save Upcoming Order
          </button>

        </div>
      </div>
    </div>
  );
}