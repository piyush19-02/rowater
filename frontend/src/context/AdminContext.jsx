import { useState } from "react";
import { AdminContext } from "./AdminContextObject";

export function AdminProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("currentAdmin");
    if (!storedAdmin) return null;
    try {
      return JSON.parse(storedAdmin);
    } catch (error) {
      console.error("Error loading admin:", error);
      return null;
    }
  });

  const loginAdmin = (admin) => {
    if (!admin?.id) return { success: false, error: "Admin login failed." };
    setCurrentAdmin(admin);
    localStorage.setItem("currentAdmin", JSON.stringify(admin));
    return { success: true, admin };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    localStorage.removeItem("currentAdmin");
  };

  return (
    <AdminContext.Provider
      value={{ currentAdmin, loginAdmin, logoutAdmin, isLoggedIn: !!currentAdmin, isLoading: false }}
    >
      {children}
    </AdminContext.Provider>
  );
}
