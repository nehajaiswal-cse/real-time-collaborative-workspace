import { useState, useEffect } from "react";

import { Box, Typography } from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import WelcomeHeader from "../components/dashboard/WelcomeHeader.jsx";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BoardsSection from "../components/dashboard/BoardsSection.jsx";
import RecentActivity from "../components/dashboard/RecentActivity";
import { getDashboardData, getBoards } from "../api/dashboardApi";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCreateBoard = () => {
    console.log("Create board clicked");
  };

  const handleViewAll = () => {
    console.log("View all boards clicked");
  };

  // Load Boards
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (error) {
        console.error("Failed to load boards:", error);
      }
    };

    loadBoards();
  }, []);

  // Load Recent Activity
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();

        setActivities(data?.activities || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setActivities([]);
      }
    };

    loadDashboard();
  }, []);

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
        <WelcomeHeader userName="User" />

        {/* Dashboard Heading */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#3F342C",
            mb: 3,
          }}
        >
          Dashboard
        </Typography>

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

