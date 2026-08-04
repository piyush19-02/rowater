// ExpensesTab.jsx

import React, { useState } from "react";
import { expenses as demoExpenses } from "../data/demoData";

export default function ExpensesTab() {

  const [showForm, setShowForm] = useState(false);

  const [expenses, setExpenses] = useState(
    demoExpenses || []
  );

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });

  // TOTAL EXPENSE
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // ADD EXPENSE
  const handleAddExpense = () => {

    if (!formData.amount || !formData.description) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: formData.amount,
      description: formData.description,
    };

    setExpenses([newExpense, ...expenses]);

    setFormData({
      amount: "",
      description: "",
    });

    setShowForm(false);
  };

  // DELETE
  const handleDelete = (id) => {
    const updated = expenses.filter(
      (item) => item.id !== id
    );

    setExpenses(updated);
  };

  return (
    <div className="w-full max-w-[600px] bg-[#f3f3f3] rounded-3xl p-4 shadow-lg border border-gray-300">

      {/* TOP */}
      <div className="flex justify-between items-center mb-5">

        <h2 className="text-lg md:text-xl font-bold text-blue-600">
          ₹{totalExpense} in last {expenses.length} entries
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Add Exp
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white border border-gray-300 rounded-2xl p-4 mb-5">

          <h3 className="font-bold text-lg mb-4 text-blue-600">
            Add Expense
          </h3>

          {/* AMOUNT */}
          <input
            type="number"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none focus:border-blue-500"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Expense Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none h-[100px] focus:border-blue-500"
          />

          {/* BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={handleAddExpense}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EXPENSE LIST */}
      <div className="space-y-4">

        {expenses.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-300 rounded-xl p-4 flex justify-between items-start shadow-sm"
          >

            {/* LEFT */}
            <div>
              <h3 className="font-bold text-red-500 text-lg">
                ₹{item.amount}
              </h3>

              <p className="text-gray-700 mt-1">
                {item.description}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3 text-sm">

              <button className="text-blue-600 font-semibold hover:underline">
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 font-bold hover:text-red-700"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      <button className="mt-6 bg-white border border-gray-400 px-5 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
        Load More
      </button>
    </div>
  );
}