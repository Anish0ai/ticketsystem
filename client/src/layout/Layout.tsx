import { Link, Outlet } from "react-router-dom";
import { FaTachometerAlt, FaTicketAlt, FaPlus, FaFolder, FaTh } from "react-icons/fa";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-6">Ticket System</h1>

        <nav className="flex flex-col gap-4 text-gray-600">
          <Link to="/" className="flex items-center gap-3 hover:text-blue-500">
            <FaTachometerAlt /> Dashboard
          </Link>

          <Link to="/tickets" className="flex items-center gap-3 hover:text-blue-500">
            <FaTicketAlt /> Tickets
          </Link>

          <Link to="/new-ticket" className="flex items-center gap-3 hover:text-blue-500">
            <FaPlus /> New Ticket
          </Link>

          <Link to="/projects" className="flex items-center gap-3 hover:text-blue-500">
            <FaFolder /> Projects
          </Link>

          <Link to="/creations" className="flex items-center gap-3 text-blue-500 font-semibold">
            <FaTh /> Creations
          </Link>
        </nav>
      </div>

      {/* Main Section */}
      <div className="flex-1">
        
        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Panel</h2>

          <div className="flex items-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              + Create Ticket
            </button>

            <div className="flex items-center gap-2">
              <span>Admin</span>
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;