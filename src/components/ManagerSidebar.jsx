// ManagerSidebar.jsx

import React from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";

export default function ManagerSidebar() {
  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex w-[240px] h-screen bg-blue-600 text-white p-5 flex-col">
        
        <h1 className="text-3xl font-bold mb-10">
          RO Panel 💧
        </h1>

        <div className="flex flex-col gap-3">

          <MenuItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />

          <MenuItem
            icon={<Users size={20} />}
            text="Customer"
          />

          <MenuItem
            icon={<LogOut size={20} />}
            text="Logout"
          />
        </div>
      </div>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white flex justify-around items-center py-3 z-50 shadow-2xl rounded-t-3xl">

        <BottomItem
          icon={<LayoutDashboard size={22} />}
          text="Home"
          active
        />

        <BottomItem
          icon={<Users size={22} />}
          text="Customer"
        />

        <BottomItem
          icon={<LogOut size={22} />}
          text="Logout"
        />
      </div>
    </>
  );
}

/* DESKTOP MENU */
function MenuItem({ icon, text, active }) {
  return (
    <button
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
        ${
          active
            ? "bg-white text-blue-600"
            : "hover:bg-blue-500"
        }
      `}
    >
      {icon}
      {text}
    </button>
  );
}

/* MOBILE MENU */
function BottomItem({ icon, text, active }) {
  return (
    <button
      className={`
        flex flex-col items-center text-xs font-medium
        ${
          active
            ? "text-yellow-300"
            : "text-white"
        }
      `}
    >
      {icon}
      <span className="mt-1">{text}</span>
    </button>
  );
}