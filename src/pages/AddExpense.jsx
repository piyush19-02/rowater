import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (!desc || !amount) return;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      description: desc,
      manager: "Piyush", // change if needed
      amount: Number(amount),
    };

    localStorage.setItem("expenses", JSON.stringify([...expenses, newEntry]));

    navigate("/expenses"); // 🔥 back to list
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 w-full bg-gray-100 min-h-screen">

        <h2 className="text-xl font-bold mb-4">Add Expense 💸</h2>

        <div className="bg-white p-4 rounded-xl shadow max-w-md">

          <input
            placeholder="Description"
            className="border p-2 w-full mb-3 rounded"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <input
            placeholder="Amount"
            className="border p-2 w-full mb-3 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleSave}
            className="bg-red-600 text-white w-full py-2 rounded"
          >
            Save Expense
          </button>

        </div>

      </div>
    </div>
  );
}