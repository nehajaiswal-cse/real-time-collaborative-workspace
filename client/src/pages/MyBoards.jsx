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

import { getWorkspaceBoards ,createBoard,updateBoard } from "../api/boardApi.js";

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

        const boardList = await getWorkspaceBoards(
          selectedWorkspace._id
        );
        

setBoards(
  Array.isArray(boardList)
    ? boardList
    : Array.isArray(boardList?.boards)
      ? boardList.boards
      : []
);
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
  
const handleBoardDeleted = (deletedBoardId) => {
  setBoards((prevBoards) =>
    prevBoards.filter((board) => board._id !== deletedBoardId)
  );
}  

const handleBoardUpdated = (result) => {
  console.log("Updated board response:", result);

  // API response directly returns the board object
  const updatedBoard = result?.board || result;

  if (!updatedBoard?._id) {
    console.error("Invalid board response:", result);
    return;
  }

  setBoards((prevBoards) =>
    prevBoards.map((board) =>
      board._id === updatedBoard._id
        ? { ...board, ...updatedBoard }
        : board
    )
  );
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

      const createdBoard = newBoard;

      setBoards((prev) => [
        createdBoard,
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
            onUpdated={handleBoardUpdated}
            onDeleted={handleBoardDeleted}
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