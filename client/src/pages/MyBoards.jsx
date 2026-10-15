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
import useResponsiveSidebar from "../hooks/useResponsiveSidebar.js";
import Sidebar from "../components/common/Sidebar.jsx";
import BoardsHeader from "../components/boards/BoardsHeader";
import BoardsGrid from "../components/boards/BoardsGrid";

import { getWorkspaceBoards ,createBoard } from "../api/boardApi.js";

import { useWorkspace } from "../context/workspaceContext.jsx";
import socket from "../socket";

const MyBoards = () => {
  const navigate = useNavigate();

  const {
    selectedWorkspace,
  } = useWorkspace();

  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useResponsiveSidebar();
  const [loading, setLoading] = useState(true);

  const [createBoardOpen, setCreateBoardOpen] =
    useState(false);

  const [newBoardName, setNewBoardName] =
    useState("");

  const [creating, setCreating] =
    useState(false);

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


  useEffect(() => {
    const workspaceId = selectedWorkspace?._id;

    if (!workspaceId) return;

    const joinWorkspace = () => {
      socket.emit("workspace:join", workspaceId);
    };

    if (socket.connected) {
      joinWorkspace();
    } else {
      socket.on("connect", joinWorkspace);
    }

    const handleBoardCreatedRealtime = (payload) => {
      const createdBoard = payload?.board || payload;

      if (
        !createdBoard?._id ||
        String(createdBoard.workspace?._id || createdBoard.workspace) !==
          String(workspaceId)
      ) {
        return;
      }

      setBoards((prevBoards) =>
        prevBoards.some((board) => board._id === createdBoard._id)
          ? prevBoards
          : [createdBoard, ...prevBoards]
      );
    };
    const handleBoardUpdatedRealtime = (payload) => {
      const updatedBoard = payload?.board || payload;

      if (!updatedBoard?._id) return;

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === updatedBoard._id
            ? { ...board, ...updatedBoard }
            : board
        )
      );
    };

    const handleBoardDeletedRealtime = (payload) => {
      const deletedBoardId =
        payload?._id || payload?.boardId || payload;

      if (!deletedBoardId) return;

      setBoards((prevBoards) =>
        prevBoards.filter(
          (board) => board._id !== deletedBoardId
        )
      );
    };

    socket.on("board:created", handleBoardCreatedRealtime);
    socket.on("board:updated", handleBoardUpdatedRealtime);
    socket.on("board:deleted", handleBoardDeletedRealtime);

    return () => {
      socket.off("connect", joinWorkspace);
      socket.off("board:created", handleBoardCreatedRealtime);
      socket.off("board:updated", handleBoardUpdatedRealtime);
      socket.off("board:deleted", handleBoardDeletedRealtime);

      if (socket.connected) {
        socket.emit("workspace:leave", workspaceId);
      }
    };
  }, [selectedWorkspace?._id]);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCreateBoard = () => {
    if (!selectedWorkspace?._id) {
      alert("Please select a workspace first.");
      return;
    }

    setCreateBoardOpen(true);
  };

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

const handleCreateBoardSubmit = async (e) => {
  e.preventDefault();

  const trimmedName = newBoardName.trim();

  if (!trimmedName) return;

  if (!selectedWorkspace?._id) {
    alert("Please select a workspace first.");
    return;
  }

  try {
    setCreating(true);

    const result = await createBoard(
      trimmedName,
      selectedWorkspace._id
    );

    // Support both { board: {...} } and direct board responses.
    const createdBoard = result?.board ?? result;

    if (!createdBoard?._id || !createdBoard?.name) {
      console.error(
        "Invalid board creation response:",
        result
      );

      alert(
        "Board was created, but its response is invalid. Check the browser console."
      );
      return;
    }

    console.log("Created board:", createdBoard);

    setBoards((prevBoards) => [
      createdBoard,
      ...prevBoards.filter(
        (board) => board._id !== createdBoard._id
      ),
    ]);

    setNewBoardName("");
    setCreateBoardOpen(false);
  } catch (error) {
    console.error("Failed to create board:", error);

    alert(
      error.response?.data?.message ||
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
            onCreateBoard={handleCreateBoard}
          />
        )}
      </Box>

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