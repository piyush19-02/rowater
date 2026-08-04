export function SummaryCard({
  earned,
  received,
  pending,
  jarSold,
  jarReturn,
}) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-4 shadow">
      
      <h2 className="text-lg font-semibold mb-3">Dashboard</h2>

      {/* MONEY SECTION */}
      <div className="grid grid-cols-3 text-center mb-4">
        <div>
          <p className="text-sm opacity-80">Earned</p>
          <p className="font-bold">₹{earned}</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Received</p>
          <p className="font-bold text-green-300">₹{received}</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Pending</p>
          <p className="font-bold text-red-300">₹{pending}</p>
        </div>
      </div>

      {/* JAR SECTION */}
      <div className="grid grid-cols-2 text-center border-t border-white/30 pt-3">
        <div>
          <p className="text-sm opacity-80">Jar Sold</p>
          <p className="font-bold text-lg">{jarSold} 🧊</p>
        </div>
        <div>
          <p className="text-sm opacity-80">Jar Return</p>
          <p className="font-bold text-lg text-yellow-300">
            {jarReturn} 🔁
          </p>
        </div>
      </div>

    </div>
  );
}