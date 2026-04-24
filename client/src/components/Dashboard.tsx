const Dashboard = () => {
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
          <p className="text-2xl font-bold">1,245</p>
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
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Product</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2">Anish</td>
              <td className="py-2">Laptop</td>
              <td className="py-2">₹50,000</td>
              <td className="py-2 text-green-500">Paid</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">Rahul</td>
              <td className="py-2">Phone</td>
              <td className="py-2">₹20,000</td>
              <td className="py-2 text-yellow-500">Pending</td>
            </tr>

            <tr>
              <td className="py-2">Kiran</td>
              <td className="py-2">Headphones</td>
              <td className="py-2">₹5,000</td>
              <td className="py-2 text-red-500">Cancelled</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;