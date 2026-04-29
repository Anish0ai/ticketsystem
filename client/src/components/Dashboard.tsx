import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface User {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/test")
      .then((res) => {
        console.log("API DATA:", res.data);

        
        setUsers(res.data.users);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Profile
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-2xl font-bold">
            {loading ? "Loading..." : users.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold">₹75,000</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Orders</h2>
          <p className="text-2xl font-bold">320</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Users (From Backend)</h2>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.id}</td>
                  <td className="py-2">{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Dashboard;