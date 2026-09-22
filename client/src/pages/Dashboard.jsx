import { useState } from "react";
import Navbar from "../components/dashboard/Navbar.jsx";
import Sidebar from "../components/dashboard/Sidebar.jsx";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onMenuClick={handleMenuClick} />

      {/* Main layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} />

        {/* Main content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          {/* Your page content here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;