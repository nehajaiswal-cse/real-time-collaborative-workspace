import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import WelcomeHeader from "../components/dashboard/WelcomeHeader.jsx";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BoardsSection from "../components/dashboard/BoardsSection.jsx";
import RecentActivity from "../components/dashboard/RecentActivity";
import WorkspaceChat from "../components/chat/WorkspaceChat";
import { getDashboardData, getBoards } from "../api/dashboardApi";
import { getMyWorkspaces, createWorkspace } from "../api/workspaceApi";
import { createBoard } from "../services/boardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [user, setUser] = useState(null);

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCreateBoard = () => {
    setCreateBoardOpen(true);
  };

  const handleViewAll = () => {
    navigate("/myboards");
  };

  const handleOpenBoard = (board) => {
    if (board && board._id) {
      navigate(`/boards/${board._id}`);
    }
  };

  // Load Workspaces and Boards
  useEffect(() => {
    const initWorkspaceData = async () => {
      try {
        let wsList = await getMyWorkspaces();
        if (!Array.isArray(wsList) || wsList.length === 0) {
          // If user has no workspace, auto-create a default personal workspace
          try {
            const newWs = await createWorkspace({ name: "My Workspace" });
            if (newWs) wsList = [newWs];
          } catch (e) {
            console.error("Auto create workspace failed:", e);
          }
        }
        setWorkspaces(wsList || []);

        const activeWs = wsList?.[0]?._id || "";
        setActiveWorkspaceId(activeWs);

        if (activeWs) {
          const boardList = await getBoards(activeWs);
          setBoards(boardList || []);
        }
      } catch (error) {
        console.error("Failed to load workspace/boards:", error);
      }
    };

    initWorkspaceData();
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

  const handleCreateBoardSubmit = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      setCreating(true);
      let targetWsId = activeWorkspaceId;
      if (!targetWsId) {
        const newWs = await createWorkspace({ name: "My Workspace" });
        targetWsId = newWs._id;
        setActiveWorkspaceId(targetWsId);
        setWorkspaces([newWs]);
      }

      const newBoard = await createBoard(newBoardName.trim(), targetWsId);
      setBoards((prev) => [newBoard, ...prev]);
      setNewBoardName("");
      setCreateBoardOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create board");
    } finally {
      setCreating(false);
    }
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
          p: 3,
          mt: "72px",
          ml: sidebarOpen ? "256px" : "72px",
          height: "calc(100vh - 72px)",
          overflowY: "auto",
          transition: "margin-left 0.3s ease",
        }}
      >
        <WelcomeHeader userName={user?.name || "User"} />

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
          onOpenBoard={handleOpenBoard}
        />

        {/* Workspace Chat */}
        {activeWorkspaceId && (
          <Box sx={{ mt: 3 }}>
            <WorkspaceChat workspaceId={activeWorkspaceId} />
          </Box>
        )}

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </Box>

      {/* Create Board Modal */}
      <Dialog
        open={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleCreateBoardSubmit}>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="Board Name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setCreateBoardOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating || !newBoardName.trim()}
              sx={{ bgcolor: "#A9744F", "&:hover": { bgcolor: "#8B5E3C" } }}
            >
              {creating ? "Creating..." : "Create Board"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
