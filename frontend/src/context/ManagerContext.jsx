import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";

const ManagerContext = createContext();

export function ManagerProvider({ children }) {
  const [currentManager, setCurrentManager] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCounts, setSidebarCounts] = useState({ partyPending: 0, deliveryPending: 0 });
  const sidebarCountsLoaded = useRef(false);

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

  const refreshSidebarCounts = useCallback(async () => {
    const [partyResult, deliveryResult] = await Promise.all([
      api("/party-orders"),
      api("/deliveries?type=regular"),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    const orders = partyResult.data || [];
    setSidebarCounts({
      partyPending: orders.filter((order) => order.status !== "completed" && order.event_date <= today).length,
      deliveryPending: (deliveryResult.data || []).filter((delivery) => delivery.delivery_status !== "delivered").length,
    });
  }, []);

  useEffect(() => {
    if (!currentManager) {
      sidebarCountsLoaded.current = false;
      return;
    }
    if (sidebarCountsLoaded.current) return;
    sidebarCountsLoaded.current = true;
    refreshSidebarCounts().catch((error) => {
      console.error("Failed to load manager sidebar counts:", error);
    });
  }, [currentManager, refreshSidebarCounts]);

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
        sidebarCounts,
        refreshSidebarCounts,
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
