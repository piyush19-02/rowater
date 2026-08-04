import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import { deliveries } from "../../data/demoData";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Load deliveries from localStorage, fallback to demoData
    const storedDeliveries = JSON.parse(localStorage.getItem("deliveries")) || deliveries;
    setRecords(storedDeliveries);
  }, []);

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Records</h1>

        <div className="bg-white rounded-lg shadow p-4">
          {records.length === 0 ? (
            <p className="text-gray-500">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Mobile</th>
                    <th className="text-left p-2">Jar</th>
                    <th className="text-left p-2">Liter</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Received</th>
                    <th className="text-left p-2">Driver</th>
                    <th className="text-left p-2">Vehicle</th>
                    <th className="text-left p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.id || index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{record.date || record.requestedAt || "N/A"}</td>
                      <td className="p-2">{record.customerName || "N/A"}</td>
                      <td className="p-2">{record.mobile || "N/A"}</td>
                      <td className="p-2">{record.jar || 0}</td>
                      <td className="p-2">{record.liter || 0}</td>
                      <td className="p-2">{record.amount || 0}</td>
                      <td className="p-2">{record.received || 0}</td>
                      <td className="p-2">{record.deliveryBoy || "N/A"}</td>
                      <td className="p-2">{record.vehicle || "N/A"}</td>
                      <td className="p-2">{record.description || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}