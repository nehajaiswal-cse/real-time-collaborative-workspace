import { useState, useEffect } from "react";

import { Box} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import WelcomeHeader from "../components/dashboard/WelcomeHeader.jsx";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BoardsSection from "../components/dashboard/BoardsSection.jsx";
import RecentActivity from "../components/dashboard/RecentActivity";
import { getBoards } from "../api/dashboardApi";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCreateBoard = async () => {
  const name = window.prompt("Enter workspace name:");

  if (!name || !name.trim()) return;

  try {
    //await createBoard(name.trim());

    const updatedBoards = await getBoards();
    setBoards(updatedBoards);
  } catch (error) {
    console.error(
      "Failed to create workspace:",
      error.response?.data || error.message
    );

    window.alert(
      error.response?.data?.message ||
      "Unable to create workspace. Please try again."
    );
  }
};

  const handleViewAll = () => {
    console.log("View all boards clicked");
  };

  // Load Boards
  // Load Recent Activity
 

useEffect(() => {
  const loadBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error(
        "Failed to load workspaces:",
        error.response?.data || error.message
      );

      setBoards([]);
    }
  };

  loadBoards();
}, []);

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userName = storedUser.name || "User";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar onMenuClick={handleMenuClick} />

      {/* Fixed Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          p: 3,

          mt: "72px",

          ml: sidebarOpen ? "256px" : "72px",

          height: "calc(100vh - 72px)",

          overflowY: "auto",

          transition: "margin-left 0.3s ease",
        }}
      >
        <WelcomeHeader userName={userName} />

        

        {/* Overview */}
        <OverviewCards />

        {/* Boards */}
        <BoardsSection
          boards={boards}
          onCreateBoard={handleCreateBoard}
          onViewAll={handleViewAll}
        />

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </Box>
    </Box>
  );
};

export default Dashboard;

