import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Expenses() {
  const [data, setData] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [visible, setVisible] = useState(5);

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth();

    let todaySum = 0;
    let monthSum = 0;

    expenses.forEach((e) => {
      const eDate = new Date(e.date);

      if (e.date === today) {
        todaySum += Number(e.amount || 0);
      }

      if (eDate.getMonth() === currentMonth) {
        monthSum += Number(e.amount || 0);
      }
    });

    // 🔥 latest first
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    setTodayTotal(todaySum);
    setMonthTotal(monthSum);
    setData(expenses);
  }, []);

  return (
    <div className="flex">
      {/* <Sidebar /> */}

      <div className="p-4 w-full bg-gray-100 min-h-screen">

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">Today</p>
            <p className="text-xl font-bold text-red-600">
              ₹{todayTotal}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-400 text-sm">This Month</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{monthTotal}
            </p>
          </div>

        </div>

        {/* 🔥 TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-4 bg-gray-50 p-3 font-semibold text-sm">
            <p>Date</p>
            <p>Description</p>
            <p>Manager</p>
            <p>Amount</p>
          </div>

          {data.length === 0 ? (
            <p className="p-4 text-center text-gray-400">
              No expense found
            </p>
          ) : (
            <>
              {data.slice(0, visible).map((e, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 p-3 border-t text-sm"
                >
                  <p>{e.date}</p>
                  <p>{e.description}</p>
                  <p>{e.manager}</p>
                  <p className="text-red-600 font-semibold">
                    ₹{e.amount}
                  </p>
                </div>
              ))}

              {/* 🔥 ALWAYS SHOW BUTTON */}
              <div className="text-center p-3">
                <button
                  onClick={() => setVisible(visible + 5)}
                  className="px-4 py-1 bg-blue-600 text-white rounded-full"
                >
                  Load More
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}