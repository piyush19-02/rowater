import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ SAME SOURCE EVERYWHERE
import { customers, deliveries } from "../data/demoData";

export default function MonthlyCustomers() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();

    const result = customers.map((c) => {
      let total = 0;
      let received = 0;

      // 🔥 FILTER CUSTOMER DATA
      const customerDeliveries = deliveries.filter(
        (d) => String(d.customer_id) === String(c.id)
      );

      // 🔥 TOTAL CALC
      customerDeliveries.forEach((d) => {
        total += Number(d.amount || 0);
        received += Number(d.received || 0);
      });

      // 🔥 LAST PAYMENT LOGIC
      const paidEntries = customerDeliveries
        .filter((d) => Number(d.received || 0) > 0)
        .map((d) => {
          if (d.date) return new Date(d.date);
          if (d.requestedAt) return new Date(d.requestedAt);
          return null;
        })
        .filter(Boolean)
        .sort((a, b) => b - a);

      let daysAgo = "-";

      if (paidEntries.length > 0) {
        const lastDate = paidEntries[0];

        const diff = Math.floor(
          (today - lastDate) / (1000 * 60 * 60 * 24)
        );

        if (diff <= 0) {
          daysAgo = "Today";
        } else if (diff === 1) {
          daysAgo = "1 day ago";
        } else {
          daysAgo = `${diff} days ago`;
        }
      }

      return {
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        pending: total - received,
        lastPayment: daysAgo,
      };
    });

    setData(result);
  }, []);

  return (
    <div className="p-4 w-full bg-gray-100 min-h-screen">

      <h2 className="text-xl font-bold mb-4">
        Monthly Customers 📅
      </h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-4 bg-gray-50 p-3 font-semibold text-sm">
          <p>ID</p>
          <p>Name / Mobile</p>
          <p>Due</p>
          <p>Last Payment</p>
        </div>

        {data.length === 0 ? (
          <p className="p-4 text-center text-gray-400">
            No data found
          </p>
        ) : (
          data.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/monthly/${c.id}`)}
              className="grid grid-cols-4 p-3 border-t cursor-pointer hover:bg-gray-50"
            >
              <p>{c.id}</p>

              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {c.mobile}
                </p>
              </div>

              <p className="text-red-600 font-semibold">
                ₹{c.pending}
              </p>

              <p>{c.lastPayment}</p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}