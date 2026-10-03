import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import BoardsHeader from "../components/boards/BoardsHeader";
import BoardsGrid from "../components/boards/BoardsGrid";
import { getBoards } from "../api/dashboardApi";
import { getMyWorkspaces, createWorkspace } from "../api/workspaceApi";
import { createBoard } from "../services/boardService";

const MyBoards = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const loadBoardsData = async () => {
    try {
      setLoading(true);
      let wsList = await getMyWorkspaces();
      if (!Array.isArray(wsList) || wsList.length === 0) {
        try {
          const newWs = await createWorkspace({ name: "My Workspace" });
          if (newWs) wsList = [newWs];
        } catch (e) {
          console.error("Auto create workspace failed:", e);
        }
      }

      const activeWs = wsList?.[0]?._id || "";
      setActiveWorkspaceId(activeWs);

      if (activeWs) {
        const boardList = await getBoards(activeWs);
        setBoards(boardList || []);
      }
    } catch (error) {
      console.error("Failed to load boards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoardsData();
  }, []);

  const handleCreateBoard = () => {
    setCreateBoardOpen(true);
  };

  const handleOpenBoard = (board) => {
    if (board && board._id) {
      navigate(`/boards/${board._id}`);
    }
  };

  const handleBoardMenuClick = (event, board) => {
    console.log("Board menu:", board);
  };

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
        <BoardsHeader onCreateBoard={handleCreateBoard} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#A9744F" }} />
          </Box>
        ) : (
          <BoardsGrid
            boards={boards}
            onOpenBoard={handleOpenBoard}
            onBoardMenuClick={handleBoardMenuClick}
          />
        )}
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
            <Button onClick={() => setCreateBoardOpen(false)} disabled={creating}>
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

export default MyBoards;