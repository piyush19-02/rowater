import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarDays, Droplets, Package, Trash2 } from "lucide-react";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";
import { api } from "../../lib/api";

const today = () => new Date().toISOString().slice(0, 10);

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { currentManager } = useManager();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [managerPassword, setManagerPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [clearError, setClearError] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    api("/party-orders")
      .then((result) => setOrders(result.data || []))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const calculate = (filter) => {
    const rows = orders.filter(filter);
    return {
      count: rows.length,
      jars: rows.reduce((sum, item) => sum + Number(item.total_jars || 0), 0),
      water: rows.reduce((sum, item) => sum + Number(item.water_liters || 0), 0),
    };
  };

  const pending = calculate(
    (order) =>
      order.status !== "completed" &&
      order.status !== "delivered" &&
      order.event_date <= today()
  );
  const upcoming = calculate(
    (order) =>
      order.status !== "completed" &&
      order.status !== "delivered" &&
      order.event_date > today()
  );

  const clearTestData = async (event) => {
    event.preventDefault();
    setClearError("");
    setIsClearing(true);

    try {
      const result = await api("/manager/clear-test-data", {
        method: "POST",
        body: {
          mobile: currentManager?.mobile,
          password: managerPassword,
          confirmation,
        },
      });

      setOrders([]);
      setNotice(result.message);
      setShowClearModal(false);
      setManagerPassword("");
      setConfirmation("");
    } catch (requestError) {
      setClearError(requestError.message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <ManagerSidebar />
      <main className="w-full p-4 pb-24 md:ml-60 md:p-6">
        <p className="text-sm font-semibold text-blue-700">Manager dashboard</p>
        <h1 className="mb-5 text-2xl font-bold">Party orders</h1>
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {notice}
          </p>
        )}
        <OrderCard
          title="Today's pending orders"
          data={pending}
          color="blue"
          onClick={() => navigate("/manager/party-orders?scope=today")}
        />
        <OrderCard
          title="Upcoming orders"
          data={upcoming}
          color="cyan"
          onClick={() => navigate("/manager/party-orders?scope=upcoming")}
        />

        <section className="mt-8 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-red-50 p-2 text-red-700">
              <Trash2 size={20} />
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900">Reset test data</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Clear delivery, payment, party order, and expense history for
                everyone. Manager/user accounts and customer profiles will
                remain; customer balances will reset to zero.
              </p>
              <button
                type="button"
                onClick={() => {
                  setClearError("");
                  setShowClearModal(true);
                }}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Clear test data
              </button>
            </div>
          </div>
        </section>
      </main>

      {showClearModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <form
            onSubmit={clearTestData}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-red-100 p-2 text-red-700">
                <AlertTriangle size={22} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Clear shared test data?
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  This permanently removes operational history for all users.
                  Customer profiles and manager accounts remain, but all
                  customer balances are reset.
                </p>
              </div>
            </div>

            {clearError && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {clearError}
              </p>
            )}

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Re-enter your manager password
              <input
                type="password"
                value={managerPassword}
                onChange={(event) => setManagerPassword(event.target.value)}
                className="input mt-1"
                autoComplete="current-password"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Type CLEAR-TEST-DATA to confirm
              <input
                type="text"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="input mt-1"
                autoComplete="off"
                required
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                disabled={isClearing}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isClearing ||
                  !managerPassword ||
                  confirmation !== "CLEAR-TEST-DATA"
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear data"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function OrderCard({ title, data, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-4 w-full rounded-3xl p-5 text-left text-white shadow transition hover:scale-[1.01] ${
        color === "blue" ? "bg-blue-600" : "bg-cyan-600"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold">{title}</span>
        <CalendarDays />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={<Package size={17} />} label="Orders" value={data.count} />
        <Stat icon={<Package size={17} />} label="Jars" value={data.jars} />
        <Stat icon={<Droplets size={17} />} label="Water (L)" value={data.water} />
      </div>
      <p className="mt-4 text-sm font-semibold underline">
        View pending & completed orders
      </p>
    </button>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3">
      <span className="flex items-center gap-1 text-xs opacity-90">
        {icon}
        {label}
      </span>
      <strong className="mt-1 block text-2xl">{value}</strong>
    </div>
  );
}
