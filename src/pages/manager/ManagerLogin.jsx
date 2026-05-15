import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManager } from "../../context/ManagerContext";
import { managers } from "../../data/demoData";
import { LogIn, AlertCircle } from "lucide-react";

export default function ManagerLogin() {
  const navigate = useNavigate();
  const { loginManager } = useManager();
  const [selectedManager, setSelectedManager] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedManager) {
      setError("Please select a manager");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter password");
      setLoading(false);
      return;
    }

    const result = loginManager(selectedManager, password);

    if (result.success) {
      setPassword("");
      navigate("/manager");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleQuickLogin = (managerId) => {
    setSelectedManager(managerId);
    const manager = managers.find(m => m.id === managerId);
    setPassword(manager.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <LogIn size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Manager Login</h1>
          <p className="text-slate-600 text-sm mt-2">Welcome to Rowater Management System</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* MANAGER SELECT */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Manager
            </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">-- Choose Manager --</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} ({manager.area})
                </option>
              ))}
            </select>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-slate-500 text-xs font-semibold">DEMO MANAGERS</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        {/* QUICK LOGIN BUTTONS */}
        <div className="space-y-2">
          {managers.map((manager) => (
            <button
              key={manager.id}
              type="button"
              onClick={() => handleQuickLogin(manager.id)}
              className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <p className="font-semibold text-slate-900 text-sm">{manager.name}</p>
              <p className="text-xs text-slate-600">{manager.area} • {manager.phone}</p>
            </button>
          ))}
        </div>

        {/* INFO BOX */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>Demo Password:</strong> All managers use password: <code className="bg-white px-1 py-0.5 rounded">123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}
