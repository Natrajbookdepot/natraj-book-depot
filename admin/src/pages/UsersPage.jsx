import React from "react";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">Yashraj Mishra</td>
            <td className="px-4 py-2">natrajadmin@gmail.com</td>
            <td className="px-4 py-2 text-blue-700">Admin</td>
            <td className="px-4 py-2 text-green-600">Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
