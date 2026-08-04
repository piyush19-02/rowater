import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";
import { monthlyCustomers, deliveries } from "../../data/demoData";

export default function ManagerMonthlyOrders() {
  const { currentManager } = useManager();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [completedCustomers, setCompletedCustomers] = useState([]);
  const [orderData, setOrderData] = useState({}); // { customerId: { jar: 0, liter: 0 } }
  const [driver, setDriver] = useState("Piyush");
  const [vehicle, setVehicle] = useState("MP04 AB1234");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const refreshData = () => {
    const today = new Date().toISOString().split("T")[0];

    const pending = [];
    const completed = [];

    customers.forEach((c) => {
      // Find today's delivery for this customer (filtered by manager)
      const todayDelivery = deliveries.find(
        (d) => String(d.customer_id) === String(c.id) && 
              (d.date === today || d.requestedAt?.startsWith(today)) &&
              (!d.managerId || d.managerId === currentManager?.id)
      );

      if (todayDelivery) {
        const amount = Number(todayDelivery.amount || 0);
        const received = Number(todayDelivery.received || 0);
        if (received >= amount) {
          completed.push(c);
        } else {
          pending.push(c);
        }
      } else {
        // No delivery today, so pending
        pending.push(c);
      }
    });

    setPendingCustomers(pending);
    setCompletedCustomers(completed);
  };

  useEffect(() => {
    // Load saved driver and vehicle
    const savedDriver = localStorage.getItem("defaultDriver") || "Piyush";
    const savedVehicle = localStorage.getItem("defaultVehicle") || "MP04 AB1234";
    setDriver(savedDriver);
    setVehicle(savedVehicle);

    refreshData();
  }, [currentManager?.id]);

  const saveSettings = () => {
    localStorage.setItem("defaultDriver", driver);
    localStorage.setItem("defaultVehicle", vehicle);
    alert("Settings saved!");
  };

  const handleInputChange = (customerId, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: field === "description" ? value : Number(value) || 0
      }
    }));
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const confirmPlaceOrder = () => {
    if (!selectedCustomer) return;

    const today = new Date().toISOString().split("T")[0];
    const { jar = 0, liter = 0, description = "", prevJarReturn = 0 } = orderData[selectedCustomer.id] || {};
    const amount = jar * 60 + liter * 2;

    if (jar === 0 && liter === 0) {
      alert("Please enter at least 1 jar or liter");
      return;
    }

    const newDelivery = {
      id: Date.now(),
      managerId: currentManager?.id, // ✅ Add manager ID
      customer_id: selectedCustomer.id,
      customerName: selectedCustomer.name,
      mobile: selectedCustomer.mobile,
      jar,
      liter,
      amount,
      description,
      prevJarReturn,
      received: amount, // Mark as completed when placing order
      date: today,
      deliveryBoy: driver,
      vehicle: vehicle,
    };

    // Add to deliveries array (in real app, save to localStorage or API)
    deliveries.push(newDelivery);

    // Save to localStorage
    localStorage.setItem("deliveries", JSON.stringify(deliveries));

    // Clear order data for this customer
    setOrderData(prev => {
      const newData = { ...prev };
      delete newData[selectedCustomer.id];
      return newData;
    });

    // Refresh the lists
    refreshData();

    closeModal();

    alert(`Order placed for ${selectedCustomer.name}`);
  };

  const currentList = activeTab === "pending" ? pendingCustomers : completedCustomers;

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Monthly Orders</h1>

        {/* Driver and Vehicle Fields */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Driver Name</label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter driver name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle No.</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter vehicle number"
              />
            </div>
            <div>
              <button
                onClick={saveSettings}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending ({pendingCustomers.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Completed ({completedCustomers.length})
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow p-4">
          {currentList.length === 0 ? (
            <p className="text-gray-500">No customers in this category.</p>
          ) : (
            <ul className="space-y-4">
              {currentList.map((c) => (
                <li key={c.id} className="p-4 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.mobile}</p>
                    </div>
                  </div>
                  {activeTab === "pending" ? (
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium">Jar</label>
                        <input
                          type="number"
                          min="0"
                          value={orderData[c.id]?.jar || 0}
                          onChange={(e) => handleInputChange(c.id, 'jar', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Liter</label>
                        <input
                          type="number"
                          min="0"
                          value={orderData[c.id]?.liter || 0}
                          onChange={(e) => handleInputChange(c.id, 'liter', e.target.value)}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </div>
                      <button
                        onClick={() => openModal(c)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Place Order
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-green-600">Jar: {c.jar || 0}, Liter: {c.liter || 0}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal */}
        {modalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Place Order for {selectedCustomer.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={orderData[selectedCustomer.id]?.description || ""}
                    onChange={(e) => handleInputChange(selectedCustomer.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pichle Jar Return</label>
                  <input
                    type="number"
                    min="0"
                    value={orderData[selectedCustomer.id]?.prevJarReturn || 0}
                    onChange={(e) => handleInputChange(selectedCustomer.id, 'prevJarReturn', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter previous jar return"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPlaceOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}