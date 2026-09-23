import { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/dashboard/Navbar.jsx";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import WelcomeHeader from "../components/dashboard/WelcomeHeader.jsx";
import OverviewCard from "../components/dashboard/OverviewCard";

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

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
                    <WelcomeHeader userName="User" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}
                    >
                        <OverviewCard
                            title="Total Boards"
                            value={12}
                            icon={<ViewKanbanIcon />}
                        />

                        <OverviewCard
                            title="Total Cards"
                            value={48}
                            icon={<AssignmentIcon />}
                        />

                        <OverviewCard
                            title="Members"
                            value={8}
                            icon={<PeopleIcon />}
                        />
                    </Box>

                    {/* Your page content here */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;