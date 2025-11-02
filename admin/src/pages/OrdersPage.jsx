import React from "react";

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">ORD1234</td>
            <td className="px-4 py-2">Aman Verma</td>
            <td className="px-4 py-2">₹520</td>
            <td className="px-4 py-2 text-green-700">Delivered</td>
            <td className="px-4 py-2">2025-11-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
