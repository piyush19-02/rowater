import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAdmin } from "../../context/useAdmin";
import { api } from "../../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api("/login", {
        method: "POST",
        body: { mobile: mobile.trim(), password, role: "admin" },
      });
      const auth = loginAdmin(result.user);
      if (auth.success) {
        navigate("/admin");
      } else {
        setError(auth.error);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="inline-flex rounded-full bg-slate-100 p-3 text-slate-700">
            <LogIn size={30} />
          </span>
          <h1 className="mt-3 text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-slate-500">Admin mobile aur password se login karein.</p>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mb-4 block text-sm font-semibold">
          Mobile
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="input mt-1"
            placeholder="Enter mobile number"
          />
        </label>
        <label className="mb-4 block text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
            placeholder="Enter password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}
