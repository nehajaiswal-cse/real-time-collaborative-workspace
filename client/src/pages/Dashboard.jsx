import { useState, useEffect } from "react";

import Navbar from "../components/dashboard/Navbar.jsx";
import Sidebar from "../components/dashboard/Sidebar.jsx";
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


  // Boards Section
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


    //  Recent Activity
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
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar onMenuClick={handleMenuClick} />

            {/* Main layout */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar open={sidebarOpen} />

                {/* Main content */}
                <main className="flex-1 p-6 min-w-0">
                    <WelcomeHeader userName="User" />

                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>

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
                </main>
            </div>
        </div>
    );
};

export default Dashboard;