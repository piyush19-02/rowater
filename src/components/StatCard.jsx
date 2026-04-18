export function StatCard({ title, value, color }) {
  return (
    <div className="bg-white mt-4 rounded-2xl p-4 shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}