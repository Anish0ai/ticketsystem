import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaFolder,
  FaTh,
  FaColumns,
} from "react-icons/fa";

const navItems = [
  { to: "/",         icon: <FaTachometerAlt />, label: "Dashboard",  end: true },
  { to: "/tickets",  icon: <FaTicketAlt />,     label: "Tickets"              },
  { to: "/kanban",   icon: <FaColumns />,        label: "Kanban"               },
  { to: "/projects", icon: <FaFolder />,         label: "Projects"             },
  { to: "/creations",icon: <FaTh />,             label: "Creations"            },
];

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-6">Ticket System</h1>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Section */}
      <div className="flex-1">
        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Panel</h2>

          <div className="flex items-center gap-4">
            <NavLink
              to="/new-ticket"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              + Create Ticket
            </NavLink>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-medium">
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