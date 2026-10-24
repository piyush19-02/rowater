// ManagerSidebar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useManager } from "../context/ManagerContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  ClipboardPlus,
  ReceiptText,
  LogOut,
} from "lucide-react";

export default function ManagerSidebar() {
  const navigate = useNavigate();
  const { logoutManager } = useManager();
  const [partyCounts, setPartyCounts] = React.useState({ pending: 0, upcoming: 0, completed: 0 });
  const [deliveryPending, setDeliveryPending] = React.useState(0);

  const handleLogout = () => {
    logoutManager();
    navigate("/manager/login");
  };

  React.useEffect(() => {
    let mounted = true;
    import('../lib/api').then(({ api }) => {
      api('/party-orders').then((r) => { if (!mounted) return; const orders = r.data || []; const todayStr = new Date().toISOString().slice(0,10); const pending = orders.filter((o) => o.status !== 'completed' && o.event_date <= todayStr).length; const upcoming = orders.filter((o) => o.status !== 'completed' && o.event_date > todayStr).length; const completed = orders.filter((o) => o.status === 'completed').length; setPartyCounts({ pending, upcoming, completed }); }).catch(() => {});
      api('/deliveries?type=regular').then((r) => { if (!mounted) return; setDeliveryPending((r.data || []).filter(d => d.delivery_status !== 'delivered').length); }).catch(() => {});
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-60 flex-col bg-slate-950 px-4 py-5 text-white shadow-xl md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-xl">💧</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">RO Panel</h1>
            <p className="text-xs text-slate-400">Manager workspace</p>
          </div>
        </div>

        <nav aria-label="Manager navigation" className="flex flex-col gap-1.5">

          <MenuItem path="/manager"
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
          />

          <MenuItem path="/manager/delivery"
            icon={<Users size={20} />}
            text={`Delivery ${deliveryPending > 0 ? `(${deliveryPending})` : ''}`}
          />
          <MenuItem path="/manager/customers" icon={<UserPlus size={20} />} text="Add customer" />
          <MenuItem path="/manager/pending-jars" icon={<Package size={20} />} text="Pending jars" />
          <MenuItem path="/manager/party-orders/add" icon={<ClipboardPlus size={20} />} text={`Party ${partyCounts.pending > 0 ? `(${partyCounts.pending})` : ''}`} />
          <MenuItem path="/manager/daily-expense" icon={<ReceiptText size={20} />} text="Expense" />

          <MenuItem onClick={handleLogout}
            icon={<LogOut size={20} />}
            text="Logout"
          />
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold text-slate-300">Daily operations</p>
          <p className="mt-1 text-xs text-slate-500">RO water management</p>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <nav aria-label="Manager navigation" className="fixed inset-x-0 bottom-0 z-50 overflow-x-auto border-t border-slate-200 bg-white/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-slate-600 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex w-max min-w-full max-w-xl items-center justify-around gap-1">

        <BottomItem path="/manager"
          icon={<LayoutDashboard size={22} />}
          text="Home"
          active
        />

        <BottomItem path="/manager/delivery"
          icon={<Users size={22} />}
          text="Delivery"
        />
        <BottomItem path="/manager/customers" icon={<UserPlus size={22} />} text="Add" />
        <BottomItem path="/manager/pending-jars" icon={<Package size={22} />} text="Jars" />
        <BottomItem path="/manager/party-orders/add" icon={<ClipboardPlus size={22} />} text="Party" />
        <BottomItem path="/manager/daily-expense" icon={<ReceiptText size={22} />} text="Expense" />

        <BottomItem onClick={handleLogout}
          icon={<LogOut size={22} />}
          text="Logout"
        />
        </div>
      </nav>
    </>
  );
}

/* DESKTOP MENU */
function MenuItem({ icon, text, path, onClick }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {icon}
        {text}
      </button>
    );
  }

  return (
    <NavLink to={path} end={path === "/manager"}
      className={({ isActive }) => `
        flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition
        ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}
      `}
    >
      {icon}
      {text}
    </NavLink>
  );
}

/* MOBILE MENU */
function BottomItem({ icon, text, path, onClick }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-12 flex-col items-center rounded-xl px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-50"
      >
        {icon}
        <span className="mt-1">{text}</span>
      </button>
    );
  }

  return (
    <NavLink to={path} end={path === "/manager"}
      className={({ isActive }) => `
        flex min-w-12 flex-col items-center rounded-xl px-2 py-1 text-[10px] font-medium
        ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}
      `}
    >
      {icon}
      <span className="mt-1">{text}</span>
    </NavLink>
  );
}
