import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";
import { api } from "../../lib/api";

export default function ManagerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api(`/party-orders/${id}`);
        // backend returns { status: true, data: { order, deliveries, payments, returns, received_total } }
        setOrder(res.data || null);
      } catch (e) {
        setError(e.message || "Failed to load order");
      }
    })();
  }, [id]);

  const receivedSum = order && order.payments ? order.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0) : (order && order.received_total ? order.received_total : (order && order.received_amount ? Number(order.received_amount) : 0));
  const pendingAmount = order && order.order ? (Number(order.order.pending_amount) || 0) : (order && order.pending_amount ? Number(order.pending_amount) : 0);
  const totalAmount = order && order.order ? (Number(order.order.total_amount) || 0) : (order && order.total_amount ? Number(order.total_amount) : 0);

  if (error) return <div className="flex"><ManagerSidebar /><main className="md:ml-60 p-6 w-full"> <p className="text-red-600">{error}</p> </main></div>;
  if (!order) return <div className="flex"><ManagerSidebar /><main className="md:ml-60 p-6 w-full"> <p>Loading...</p> </main></div>;

  const printInvoice = () => {
    const html = `
      <html><head><title>Invoice ${order.order_no || ''}</title><style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ccc;text-align:left}thead{background:#f4f4f4}</style></head><body>
      <h1>Invoice: ${order.order_no || ''}</h1>
      <p>${order.customer_name} · ${order.mobile}</p>
      <p>Event: ${order.event_name} · ${order.event_date}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
      <tr><td>Jar</td><td>${order.total_jars}</td><td>₹${order.rate || 0}</td><td>₹${order.total_amount}</td></tr>
      </tbody></table>
      <p>Total: ₹${order.total_amount}</p>
      <p>Received: ₹${order.received_amount || 0}</p>
      <p>Pending: ₹${order.pending_amount || 0}</p>
      </body></html>
    `;
    const w = window.open("", "InvoicePrint");
    if (!w) return;
    w.document.open(); w.document.write(html); w.document.close(); w.print();
  };

  return (
    <div className="flex">
      <ManagerSidebar />
      <main className="md:ml-60 p-6 w-full bg-slate-100 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Order {order.order_no || ''}</h1>
              <p className="text-sm text-slate-500">{order.customer_name} · {order.mobile}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="rounded-lg bg-slate-100 px-3 py-2">Back</button>
              <button onClick={printInvoice} className="rounded-lg bg-slate-100 px-3 py-2">Print Invoice</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>Event</div><div className="text-right">{order.event_name}</div>
            <div>Event date</div><div className="text-right">{order.event_date}</div>
            <div>Delivery address</div><div className="text-right">{order.delivery_address}</div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between mb-2"><div>Jars</div><div>× { (order.order ? order.order.total_jars : order.total_jars) || 0 }</div></div>
            <div className="flex justify-between mb-2"><div>Rate</div><div>₹{ (order.order ? order.order.rate : order.rate) || 0 }</div></div>
            <div className="flex justify-between mb-2"><div>Total</div><div>₹{ totalAmount }</div></div>
            <div className="flex justify-between mb-2"><div>Received</div><div>₹{ receivedSum }</div></div>
            <div className="flex justify-between mb-2"><div>Pending</div><div>₹{ pendingAmount }</div></div>
          </div>

          {/* History: deliveries, payments, returns */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">History</h3>
            {order.deliveries && order.deliveries.length ? (
              <div className="mb-3">
                <div className="text-sm text-slate-500 mb-2">Deliveries</div>
                <div className="space-y-2">
                  {order.deliveries.map((d) => (
                    <div key={d.id} className="flex justify-between items-center border-b py-2">
                      <div>
                        <div className="font-medium">Delivery · {d.delivery_no || ''}</div>
                        <div className="text-xs text-slate-500">{d.delivery_date} · {d.manager_name ? `By: ${d.manager_name}` : ''}</div>
                        <div className="text-xs text-slate-500">Jars: {d.delivered_jars} · Returned: {d.returned_jars}</div>
                      </div>
                      <div className="text-right">
                        <div>₹{Number(d.amount || d.received_amount || 0)}</div>
                        <div className="text-xs text-amber-700">{d.delivered_jars} jar{d.delivered_jars>1?'s':''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {order.payments && order.payments.length ? (
              <div className="mb-3">
                <div className="text-sm text-slate-500 mb-2">Payments</div>
                <div className="space-y-2">
                  {order.payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center border-b py-2">
                      <div>
                        <div className="font-medium">Payment</div>
                        <div className="text-xs text-slate-500">{p.payment_date} · {p.manager_name ? `By: ${p.manager_name}` : ''} · {p.payment_mode}</div>
                        <div className="text-xs text-slate-500">{p.remarks || ''}</div>
                      </div>
                      <div className="text-right">
                        <div>₹{Number(p.amount || 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {order.returns && order.returns.length ? (
              <div className="mb-3">
                <div className="text-sm text-slate-500 mb-2">Returns</div>
                <div className="space-y-2">
                  {order.returns.map((r) => (
                    <div key={r.id} className="flex justify-between items-center border-b py-2">
                      <div>
                        <div className="font-medium">Return</div>
                        <div className="text-xs text-slate-500">{r.return_date} · {r.remarks || ''}</div>
                      </div>
                      <div className="text-right text-amber-700">{r.returned_jars} jar{r.returned_jars>1?'s':''}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
