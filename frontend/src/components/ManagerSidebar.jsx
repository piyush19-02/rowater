// ManagerSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
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
  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex w-[240px] h-screen bg-blue-600 text-white p-5 flex-col">
        
        <h1 className="text-3xl font-bold mb-10">
          RO Panel 💧
        </h1>

        <div className="flex flex-col gap-3">

          <MenuItem path="/manager"
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
          />

          <MenuItem path="/manager/delivery"
            icon={<Users size={20} />}
            text="Delivery"
          />
          <MenuItem path="/manager/customers" icon={<UserPlus size={20} />} text="Add customer" />
          <MenuItem path="/manager/pending-jars" icon={<Package size={20} />} text="Pending jars" />
          <MenuItem path="/manager/party-orders/add" icon={<ClipboardPlus size={20} />} text="Add party order" />
          <MenuItem path="/manager/daily-expense" icon={<ReceiptText size={20} />} text="Expense" />

          <MenuItem path="/manager/login"
            icon={<LogOut size={20} />}
            text="Logout"
          />
        </div>
      </div>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full overflow-x-auto bg-blue-600 text-white z-50 shadow-2xl rounded-t-3xl">
        <div className="flex min-w-max items-center gap-1 px-2 py-3">

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

        <BottomItem path="/manager/login"
          icon={<LogOut size={22} />}
          text="Logout"
        />
        </div>
      </div>
    </>
  );
}

/* DESKTOP MENU */
function MenuItem({ icon, text, path }) {
  return (
    <NavLink to={path} end={path === "/manager"}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition
        ${isActive ? "bg-white text-blue-600" : "hover:bg-blue-500"}
      `}
    >
      {icon}
      {text}
    </NavLink>
  );
}

/* MOBILE MENU */
function BottomItem({ icon, text, path }) {
  return (
    <NavLink to={path} end={path === "/manager"}
      className={({ isActive }) => `
        min-w-14 flex flex-col items-center text-xs font-medium
        ${isActive ? "text-yellow-300" : "text-white"}
      `}
    >
      {icon}
      <span className="mt-1">{text}</span>
    </NavLink>
  );
}
