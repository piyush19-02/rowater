import ManagerSidebar from "../../components/ManagerSidebar";

export default function BulkOrder() {
  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <h1 className="text-3xl font-bold mb-4">Bulk Orders</h1>
        <p className="text-slate-600">Manager bulk order management appears here.</p>
      </div>
    </div>
  );
}
