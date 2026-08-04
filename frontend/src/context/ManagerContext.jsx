import { createContext, useContext, useState, useEffect } from "react";

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
  const loginManager = (manager) => {
    if (!manager?.id) return { success: false, error: "Manager select karein" };
    setCurrentManager(manager);
    localStorage.setItem("currentManager", JSON.stringify(manager));
    return { success: true, manager };
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
