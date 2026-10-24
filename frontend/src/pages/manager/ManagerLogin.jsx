import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useManager } from "../../context/ManagerContext";
import { api } from "../../lib/api";

export default function ManagerLogin() {
  const navigate = useNavigate();
  const { loginManager } = useManager();
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
        body: { mobile: mobile.trim(), password, role: "manager" },
      });

      const auth = loginManager(result.user);
      if (auth.success) {
        navigate("/manager");
      } else {
        setError(auth.error);
      }
    } catch (err) {
      setError(err.message || "Login failed. Check your mobile and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-700 to-cyan-500 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="inline-flex rounded-full bg-blue-100 p-3 text-blue-700"><LogIn size={30} /></span>
          <h1 className="mt-3 text-2xl font-bold">Manager login</h1>
          <p className="mt-1 text-sm text-slate-500">Mobile aur password se manager login karein.</p>
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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login as Manager"}
        </button>
      </form>
    </div>
  );
}
