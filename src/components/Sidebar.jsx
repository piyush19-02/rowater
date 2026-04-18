import { NavLink } from "react-router-dom";
import { Home, Users, Truck, Plus } from "lucide-react";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Delivery", path: "/delivery", icon: <Truck size={20} /> },
        { name: "Add Expense", path: "/expenses/add ", icon: <Plus size={20} /> },
                { name: "Add order", path: "/add-order", icon: <Plus size={20} /> },


    
  ];

  return (
    <>
      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:block w-60 h-screen bg-blue-600 text-white p-4 fixed">
        <h2 className="text-xl font-bold mb-6">RO Panel 💧</h2>

        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2 mb-3 p-2 rounded transition ${
                isActive
                  ? "bg-white text-blue-600 font-semibold"
                  : "hover:bg-blue-500"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* ✅ Mobile Bottom Navbar (Snapchat Style) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around py-2 z-50">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-500"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}