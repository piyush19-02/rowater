import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function Delivery() {
  const [customers, setCustomers] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({});
  const [todayDeliveries, setTodayDeliveries] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(data);
    loadToday();
  }, []);

  const loadToday = () => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const today = new Date().toISOString().split("T")[0];

    const retail = {};

    deliveries.forEach((d) => {
      if (d.date === today && d.customer_id) {
        if (!retail[d.customer_id]) {
          retail[d.customer_id] = {
            totalAmount: 0,
            received: 0,
          };
        }

        retail[d.customer_id].totalAmount += Number(d.amount || 0);
        retail[d.customer_id].received += Number(d.received || 0);
      }
    });

    setTodayDeliveries(retail);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (customer) => {
    const today = new Date().toISOString().split("T")[0];

    const jar = Number(form.jar || 0);
    const liter = Number(form.liter || 0);
    let received = Number(form.received || 0);
    const status = form.status || "pending";

    if (jar === 0 && liter === 0) return;

    const amount = jar * 60 + liter * 2;

    if (status === "paid") {
      received = amount;
    }

    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    const newEntry = {
      id: Date.now(),

      customer_id: customer.id,
      customerName: customer.name,
      mobile: customer.mobile,
      address: customer.shop,

      jar,
      liter,
      amount,
      received,
      status,

      method: form.method || "delivery",
      vehicle: form.vehicle || "",
      driver: form.driver || "",
      deliveryBoy: form.deliveryBoy || "Piyush",

      date: today,
      time: new Date().toLocaleTimeString(),
    };

    localStorage.setItem(
      "deliveries",
      JSON.stringify([...deliveries, newEntry])
    );

    setForm({});
    setOpenId(null);
    loadToday();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 w-full bg-gray-100 min-h-screen pb-20">

        <h2 className="text-xl font-bold mb-4">Delivery 🚚</h2>

        {customers.map((c) => {
          const d = todayDeliveries[c.id];

          return (
            <div key={c.id} className="bg-white p-4 mb-3 rounded-xl shadow">

              {/* HEADER */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.shop}</p>
                </div>

                <button
                  onClick={() =>
                    setOpenId(openId === c.id ? null : c.id)
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  + Sale
                </button>
              </div>

              {/* SUMMARY */}
              {d && (
                <div className="mt-3 bg-gray-50 p-3 rounded text-sm">

                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{d.totalAmount}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Received</span>
                    <span>₹{d.received}</span>
                  </div>

                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Pending</span>
                    <span>₹{d.totalAmount - d.received}</span>
                  </div>

                </div>
              )}

              {/* FORM */}
              {openId === c.id && (
                <div className="mt-4 grid grid-cols-2 gap-2">

                  <input placeholder="Jar" className="border p-2 rounded"
                    onChange={(e)=>handleChange("jar", e.target.value)} />

                  <input placeholder="Water (Liter)" className="border p-2 rounded"
                    onChange={(e)=>handleChange("liter", e.target.value)} />

                  <input placeholder="Advance (Received)" className="border p-2 rounded col-span-2"
                    onChange={(e)=>handleChange("received", e.target.value)} />

                  <input placeholder="Delivery Boy" className="border p-2 rounded col-span-2"
                    onChange={(e)=>handleChange("deliveryBoy", e.target.value)} />

                  <select className="border p-2 rounded col-span-2"
                    onChange={(e)=>handleChange("method", e.target.value)}>
                    <option value="delivery">Delivery</option>
                    <option value="self">Self Pickup</option>
                  </select>

                  {form.method === "self" && (
                    <>
                      <input placeholder="Vehicle No" className="border p-2 rounded"
                        onChange={(e)=>handleChange("vehicle", e.target.value)} />

                      <input placeholder="Driver Name" className="border p-2 rounded"
                        onChange={(e)=>handleChange("driver", e.target.value)} />
                    </>
                  )}

                  <select className="border p-2 rounded col-span-2"
                    onChange={(e)=>handleChange("status", e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>

                  {/* LIVE TOTAL */}
                  <div className="col-span-2 text-right font-semibold text-blue-600">
                    Total: ₹{(Number(form.jar || 0) * 60) + (Number(form.liter || 0) * 2)}
                  </div>

                  <button
                    onClick={()=>handleSave(c)}
                    className="col-span-2 bg-green-600 text-white p-2 rounded"
                  >
                    Save
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}