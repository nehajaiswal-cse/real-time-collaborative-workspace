
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
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
import { getActivities } from "../api/activityApi.js";
import WorkspaceDocuments from "../components/documents/WorkspaceDocuments";
import { getDashboardData, getBoards } from "../api/dashboardApi";
import { getMyWorkspaces, createWorkspace } from "../api/workspaceApi";
import { createBoard } from "../services/boardService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [error, setError] = useState("");

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCreateBoard = () => {
    setError("");
    setNewBoardName("");
    setCreateBoardOpen(true);
  };

  const handleViewAll = () => {
    navigate("/myboards");
  };

  const handleOpenBoard = (board) => {
    const boardId = board?._id || board?.id;

    if (!boardId) {
      setError("Unable to open this board because its ID is missing.");
      return;
    }

    navigate(`/boards/${boardId}`);
  };

  // Load workspaces first, then load boards for the selected workspace.
  
  useEffect(() => {
    let cancelled = false;

    const loadWorkspaceAndBoards = async () => {
      setLoadingBoards(true);
      setError("");

      try {
        let workspaces = await getMyWorkspaces();

        if (!Array.isArray(workspaces)) {
          workspaces = [];
        }

        if (workspaces.length === 0) {
          const workspace = await createWorkspace({
            name: "My Workspace",
          });

          if (workspace) {
            workspaces = [workspace];
          }
        }

        const workspaceId = workspaces[0]?._id || workspaces[0]?.id || "";

        if (cancelled) return;

        setActiveWorkspaceId(workspaceId);

        if (!workspaceId) {
          setBoards([]);
          return;
        }

        const boardList = await getBoards(workspaceId);

        if (!cancelled) {
          setBoards(Array.isArray(boardList) ? boardList : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load workspaces and boards:", err);
          setError(err.message || "Unable to load your boards.");
        }
      } finally {
        if (!cancelled) {
          setLoadingBoards(false);
        }
      }
    };

    loadWorkspaceAndBoards();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load activity separately. Do not load boards again without a workspace ID.
  useEffect(() => {
    let cancelled = false;

    const loadActivity = async () => {
      try {
        const data = await getDashboardData();

        if (!cancelled) {
          setActivities(data?.activities || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard activity:", err);

        if (!cancelled) {
          setActivities([]);
        }
      }
    };

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
  const loadRecentActivity = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error("Failed to load recent activities:", error);
      setActivities([]);
    }
  };

  loadRecentActivity();
}, []);

  const handleCreateBoardSubmit = async (event) => {
    event.preventDefault();

    const boardName = newBoardName.trim();

    if (!boardName || creating) return;

    setCreating(true);
    setError("");

    try {
      let workspaceId = activeWorkspaceId;

      if (!workspaceId) {
        const workspace = await createWorkspace({
          name: "My Workspace",
        });

        workspaceId = workspace?._id || workspace?.id;

        if (!workspaceId) {
          throw new Error("Could not create or find a workspace.");
        }

        setActiveWorkspaceId(workspaceId);
      }

      const newBoard = await createBoard(boardName, workspaceId);

      if (!newBoard?._id && !newBoard?.id) {
        throw new Error("The server did not return the created board.");
      }

      setBoards((previousBoards) => [newBoard, ...previousBoards]);
      setNewBoardName("");
      setCreateBoardOpen(false);
    } catch (err) {
      console.error("Failed to create board:", err);
      setError(err.message || "Failed to create board. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const userName = user?.name || "User";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        color: "#3F342C",
      }}
    >
      <Navbar onMenuClick={handleMenuClick} />

      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          p: 3,
          mt: "72px",
          ml: sidebarOpen ? "256px" : "72px",
          minHeight: "calc(100vh - 72px)",
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "margin-left 0.3s ease",
        }}
      >
        <WelcomeHeader userName={userName} />

        <OverviewCards />

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <BoardsSection
          boards={boards}
          loading={loadingBoards}
          onCreateBoard={handleCreateBoard}
          onViewAll={handleViewAll}
          onOpenBoard={handleOpenBoard}
        />

        {activeWorkspaceId && (
          <Box sx={{ mt: 3 }}>
            <WorkspaceChat workspaceId={activeWorkspaceId} />
          </Box>
        )}

        {/* Collaborative Documents */}
        {activeWorkspaceId && (
          <Box sx={{ mt: 3 }}>
            <WorkspaceDocuments workspaceId={activeWorkspaceId} />
          </Box>
        )}

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
        <RecentActivity activities={activities} />
      </Box>

      <Dialog
        open={createBoardOpen}
        onClose={() => {
          if (!creating) setCreateBoardOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleCreateBoardSubmit}>
          <DialogTitle sx={{ color: "#3F342C" }}>
            Create New Board
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              required
              label="Board Name"
              value={newBoardName}
              onChange={(event) => setNewBoardName(event.target.value)}
              margin="normal"
              inputProps={{ maxLength: 100 }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setCreateBoardOpen(false)}
              disabled={creating}
              sx={{ color: "#77716C" }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={creating || !newBoardName.trim()}
              sx={{
                bgcolor: "#A9744F",
                "&:hover": { bgcolor: "#8B5E3C" },
              }}
            >
              {creating ? "Creating..." : "Create Board"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dashboard;