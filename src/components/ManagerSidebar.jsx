import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, DollarSign, ArrowLeft, Shield, LogOut, User, Truck } from "lucide-react";
import { useManager } from "../context/ManagerContext";

export default function ManagerSidebar() {
  const navigate = useNavigate();
  const { currentManager, logoutManager } = useManager();

  const menu = [
    { name: "Manager Home", path: "/manager", icon: <LayoutDashboard size={20} /> },
    { name: "Daily Customers", path: "/manager/daily-customers", icon: <Users size={20} /> },
    { name: "Daily Expense", path: "/manager/daily-expense", icon: <DollarSign size={20} /> },
    { name: "Delivery", path: "/manager/delivery", icon: <Truck size={20} /> },
    { name: "Bulk Orders", path: "/manager/bulk-order", icon: <ClipboardList size={20} /> },
  ];

  const handleLogout = () => {
    logoutManager();
    navigate("/manager/login");
  };

  return (
    <div className="hidden md:block w-60 h-screen bg-slate-900 text-white p-4 fixed flex flex-col">
      <div>
        <h2 className="text-xl font-bold mb-2">Manager Panel</h2>
        
        {/* CURRENT MANAGER INFO */}
        {currentManager && (
          <div className="bg-slate-800 rounded-lg p-3 mb-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-blue-400" />
              <p className="text-xs font-semibold text-blue-300">LOGGED IN</p>
            </div>
            <p className="text-sm font-bold text-white mb-1">{currentManager.name}</p>
            <p className="text-xs text-slate-400">{currentManager.area}</p>
          </div>
        )}

        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/manager"}
            className={({ isActive }) =>
              `flex items-center gap-3 mb-3 p-3 rounded-xl transition ${
                isActive ? "bg-white text-slate-900 font-semibold" : "bg-slate-800 hover:bg-slate-700"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 mb-3 p-3 rounded-xl transition ${
              isActive ? "bg-white text-slate-900 font-semibold" : "bg-slate-800 hover:bg-slate-700"
            }`
          }
        >
          <Shield size={20} />
          <span>Admin Dashboard</span>
        </NavLink>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
