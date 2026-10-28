import { NavLink } from "react-router-dom";
import { Home, Users, Plus, Briefcase } from "lucide-react";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    // { name: "Delivery", path: "/delivery", icon: <Truck size={20} /> },
    { name: "Add Expense", path: "/expenses/add", icon: <Plus size={20} /> },
    { name: "Add order", path: "/add-order", icon: <Plus size={20} /> },
    { name: "Managers", path: "/managers", icon: <Briefcase size={20} /> },
    // { name: "Manager", path: "/manager", icon: <Briefcase size={20} /> },
  ];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-slate-950 px-4 py-5 text-white shadow-xl md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-xl">💧</span>
          <div>
            <h2 className="text-lg font-bold leading-tight">RO Panel</h2>
            <p className="text-xs text-slate-400">Admin workspace</p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-col gap-1.5">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold text-slate-300">Water delivery management</p>
          <p className="mt-1 text-xs text-slate-500">Admin panel</p>
        </div>
      </aside>

      <nav aria-label="Admin navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium leading-tight transition ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"
                }`
              }
            >
              {item.icon}
              <span className="max-w-full truncate">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
