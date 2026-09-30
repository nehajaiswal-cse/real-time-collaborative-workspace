

import { useState } from "react";
import { Box } from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import BoardsHeader from "../components/boards/BoardsHeader";
import BoardsGrid from "../components/boards/BoardsGrid";

const MyBoards = () => {
    const [boards] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleMenuClick = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleCreateBoard = () => {
        // Connect the create-board API/modal here later.
    };

    const handleOpenBoard = (board) => {
        // Navigate to the selected board later.
        console.log("Open board:", board);
    };

    const handleBoardMenuClick = (event, board) => {
        // Show edit/delete menu later.
        console.log("Board menu:", board);
    };

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
                    boxSizing: "border-box",
                    mt: "72px",
                    ml: sidebarOpen ? "256px" : "72px",
                    height: "calc(100vh - 72px)",
                    overflowY: "auto",
                    minWidth: 0,
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4,
                    },
                    transition: "margin-left 0.3s ease",
                }}
            >
                <BoardsHeader
                    onCreateBoard={handleCreateBoard}
                />

                <BoardsGrid
                    boards={boards}
                    onOpenBoard={handleOpenBoard}
                    onBoardMenuClick={handleBoardMenuClick}
                />
            </Box>
        </Box>
    );
};

export default MyBoards;