import { createContext, useContext, useState, useEffect } from "react";
import { managers } from "../data/demoData";

const ManagerContext = createContext();

export function ManagerProvider({ children }) {
  const [currentManager, setCurrentManager] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load manager from localStorage on mount
  useEffect(() => {
    const storedManager = localStorage.getItem("currentManager");
    if (storedManager) {
      try {
        setCurrentManager(JSON.parse(storedManager));
      } catch (error) {
        console.error("Error loading manager:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Login manager
  const loginManager = (managerId, password) => {
    const manager = managers.find(m => m.id === managerId);
    
    if (!manager) {
      return { success: false, error: "Manager not found" };
    }

    if (manager.password !== password) {
      return { success: false, error: "Invalid password" };
    }

    const managerData = {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      area: manager.area,
      phone: manager.phone,
    };

    setCurrentManager(managerData);
    localStorage.setItem("currentManager", JSON.stringify(managerData));
    return { success: true, manager: managerData };
  };

  // Logout manager
  const logoutManager = () => {
    setCurrentManager(null);
    localStorage.removeItem("currentManager");
  };

  // Check if manager is logged in
  const isLoggedIn = !!currentManager;

  return (
    <ManagerContext.Provider
      value={{
        currentManager,
        loginManager,
        logoutManager,
        isLoggedIn,
        isLoading,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
}

// Hook to use manager context
export function useManager() {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error("useManager must be used within ManagerProvider");
  }
  return context;
}
