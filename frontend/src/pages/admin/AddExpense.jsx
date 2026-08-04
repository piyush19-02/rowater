import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Plus } from "lucide-react";

const defaultCategories = ["Fuel", "Salary", "Electricity", "RO Maintenance", "Jar Purchase", "Vehicle Repair", "Office Expense", "Other"];
const readCategories = () => {
  try { return JSON.parse(localStorage.getItem("expenseCategories")) || defaultCategories; } catch { return defaultCategories; }
};

export default function AddExpense() {
  const [categories, setCategories] = useState(readCategories);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState(false);

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name || categories.some((item) => item.toLowerCase() === name.toLowerCase())) return;
    const next = [...categories, name];
    localStorage.setItem("expenseCategories", JSON.stringify(next));
    setCategories(next); setCategory(name); setNewCategory("");
  };
  const handleSave = () => {
    if (!category || !amount) return window.alert("Category aur amount required hai.");
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    localStorage.setItem("expenses", JSON.stringify([...expenses, { id: Date.now(), date: new Date().toISOString().slice(0, 10), category, description: desc, amount: Number(amount) }]));
    setDesc(""); setAmount(""); setCategory(""); setSaved(true);
  };

  return <div className="flex bg-slate-100"><Sidebar />
    <main className="min-h-screen w-full p-4 pb-24 md:ml-60 md:p-6">
      <p className="text-sm font-semibold text-blue-700">Admin control</p><h1 className="mb-5 text-2xl font-bold">Add expense</h1>
      <div className="max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <label className="mb-3 block text-sm font-semibold">Expense category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input mt-1"><option value="">Category select karein</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <div className="mb-4 flex gap-2"><input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input" placeholder="New category (admin only)" /><button onClick={addCategory} className="rounded-xl bg-slate-800 px-3 text-white" aria-label="Add category"><Plus size={19} /></button></div>
        <label className="mb-3 block text-sm font-semibold">Amount<input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="input mt-1" placeholder="0" /></label>
        <label className="mb-4 block text-sm font-semibold">Description<textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input mt-1 min-h-24" placeholder="Expense detail" /></label>
        {saved && <p className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">Expense saved successfully.</p>}
        <button onClick={handleSave} className="w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700">Save expense</button>
      </div>
    </main>
  </div>;
}
