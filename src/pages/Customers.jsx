import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Plus, X, MessageCircle } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [shop, setShop] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  const nav = useNavigate();

  // ✅ Load customers
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(data);
  }, []);

  // ✅ Add customer
  const addCustomer = () => {
    if (!name || !mobile) return;

    const newCustomer = {
      id: Date.now(),
      name,
      mobile,
      shop,
      hasAccount,
    };

    const updated = [...customers, newCustomer];
    localStorage.setItem("customers", JSON.stringify(updated));
    setCustomers(updated);

    // reset
    setName("");
    setMobile("");
    setShop("");
    setHasAccount(false);
    setShowForm(false);
  };

  // ✅ Balance calculate
  const getBalance = (id) => {
    const ledger = JSON.parse(localStorage.getItem("ledger")) || [];
    let balance = 0;

    ledger.forEach((l) => {
      if (l.customer_id == id) {
        if (l.type === "delivery") balance += l.amount;
        if (l.type === "payment") balance -= l.amount;
      }
    });

    return balance;
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 w-full bg-gray-100 min-h-screen pb-20">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Customers 👥</h2>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>

        {/* 🔥 LIST */}
        <div className="space-y-3">
          {customers.map((c) => {
            const balance = getBalance(c.id);

            return (
              <div
                key={c.id}
                onClick={() => nav(`/customer/${c.id}`)} // 🔥 FIXED
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition cursor-pointer"
              >
                {/* LEFT */}
                <div>
                  <p className="font-semibold text-gray-800">{c.name}</p>

                  {c.shop && (
                    <p className="text-sm text-gray-500">{c.shop}</p>
                  )}

                  <p className="text-xs text-gray-400">
                    📞 {c.mobile}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                  {/* 💬 WHATSAPP */}
                  <a
                    href={`https://wa.me/91${c.mobile}?text=Hello%20${c.name}%20👋`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()} // 🔥 IMPORTANT
                    className="bg-green-100 p-2 rounded-full hover:scale-110 transition"
                  >
                    <MessageCircle className="text-green-600" size={18} />
                  </a>

                  {/* 💰 BALANCE */}
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        balance > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{balance}
                    </p>

                    <p className="text-xs text-gray-400">
                      {balance > 0 ? "Pending" : "Advance"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔥 MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl">

              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Add Customer</h2>

                <button onClick={() => setShowForm(false)}>
                  <X />
                </button>
              </div>

              <input
                className="border p-3 w-full mb-3 rounded-lg"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border p-3 w-full mb-3 rounded-lg"
                placeholder="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              <input
                className="border p-3 w-full mb-3 rounded-lg"
                placeholder="Shop Name"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
              />

              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={hasAccount}
                  onChange={(e) => setHasAccount(e.target.checked)}
                />
                Account Customer
              </label>

              <button
                onClick={addCustomer}
                className="bg-blue-600 text-white w-full py-3 rounded-lg shadow hover:scale-105 transition"
              >
                Save Customer
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}