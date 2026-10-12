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
import { createWorkspace } from "../api/workspaceApi";
import { createBoard } from "../services/boardService";

import { useWorkspace } from "../context/workspaceContext.jsx";

const MyBoards = () => {
  const navigate = useNavigate();

  const {
    selectedWorkspace,
  } = useWorkspace();

  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [createBoardOpen, setCreateBoardOpen] =
    useState(false);

  const [newBoardName, setNewBoardName] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  // ==========================================
  // Load boards for selected workspace
  // ==========================================

  useEffect(() => {
    const loadBoards = async () => {
      if (!selectedWorkspace?._id) {
        setBoards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log(
          "Loading boards for workspace:",
          selectedWorkspace._id
        );

        const boardList = await getBoards(
          selectedWorkspace._id
        );
        

        setBoards(boardList || []);
      } catch (error) {
        console.error(
          "Failed to load boards:",
          error
        );

        setBoards([]);
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, [selectedWorkspace?._id]);

  // ==========================================
  // Sidebar
  // ==========================================

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ==========================================
  // Create Board
  // ==========================================

  const handleCreateBoard = () => {
    if (!selectedWorkspace?._id) {
      alert("Please select a workspace first.");
      return;
    }

    setCreateBoardOpen(true);
  };

  // ==========================================
  // Open Board
  // ==========================================

  const handleOpenBoard = (board) => {
    if (board?._id) {
      navigate(`/boards/${board._id}`);
    }
  };

  const handleBoardMenuClick = (
    event,
    board
  ) => {
    console.log("Board menu:", board);
  };

  // ==========================================
  // Create Board Submit
  // ==========================================

  const handleCreateBoardSubmit = async (e) => {
    e.preventDefault();

    if (!newBoardName.trim()) return;

    if (!selectedWorkspace?._id) {
      alert("Please select a workspace first.");
      return;
    }

    try {
      setCreating(true);

      const newBoard = await createBoard(
        newBoardName.trim(),
        selectedWorkspace._id
      );

      setBoards((prev) => [
        newBoard,
        ...prev,
      ]);

      setNewBoardName("");
      setCreateBoardOpen(false);
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to create board"
      );
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
      <Navbar
        onMenuClick={handleMenuClick}
      />

      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          boxSizing: "border-box",

          mt: "72px",

          ml: sidebarOpen
            ? "256px"
            : "72px",

          height: "calc(100vh - 72px)",

          overflowY: "auto",

          minWidth: 0,

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          transition:
            "margin-left 0.3s ease",
        }}
      >
        <BoardsHeader
          onCreateBoard={
            handleCreateBoard
          }
        />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress
              sx={{
                color: "#A9744F",
              }}
            />
          </Box>
        ) : (
          <BoardsGrid
            boards={boards}
            onOpenBoard={
              handleOpenBoard
            }
            onBoardMenuClick={
              handleBoardMenuClick
            }
          />
        )}
      </Box>

      {/* ================================= */}
      {/* CREATE BOARD DIALOG */}
      {/* ================================= */}

      <Dialog
        open={createBoardOpen}
        onClose={() =>
          setCreateBoardOpen(false)
        }
        fullWidth
        maxWidth="xs"
      >
        <form
          onSubmit={
            handleCreateBoardSubmit
          }
        >
          <DialogTitle>
            Create New Board
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              label="Board Name"
              value={newBoardName}
              onChange={(e) =>
                setNewBoardName(
                  e.target.value
                )
              }
              margin="normal"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setCreateBoardOpen(false)
              }
              disabled={creating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                creating ||
                !newBoardName.trim()
              }
              sx={{
                bgcolor: "#A9744F",

                "&:hover": {
                  bgcolor: "#8B5E3C",
                },
              }}
            >
              {creating
                ? "Creating..."
                : "Create Board"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MyBoards;