
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

import {
  getWorkspaceBoards,
  getBoardById,
} from "../api/boardApi";

const BoardDetail = () => {
  const navigate = useNavigate();

  // App.jsx gives us boardId
  const { boardId } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [boards, setBoards] = useState([]);
  const [workspaceId, setWorkspaceId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("BoardDetail boardId:", boardId);
  console.log("BoardDetail workspaceId:", workspaceId);

  const fetchBoards = async () => {
    if (!boardId) {
      setError("Board ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // STEP 1:
      // Get the selected board
      const boardResponse = await getBoardById(boardId);

      const board = boardResponse.board;

      if (!board) {
        setError("Board not found.");
        return;
      }

      // STEP 2:
      // Get workspace ID from the board
      const currentWorkspaceId =
        board.workspace?._id || board.workspace;

      if (!currentWorkspaceId) {
        setError("Workspace ID not found for this board.");
        return;
      }

      console.log(
        "Workspace ID from board:",
        currentWorkspaceId
      );

      setWorkspaceId(currentWorkspaceId);

      // STEP 3:
      // Get all boards belonging to this workspace
      const boardsResponse = await getWorkspaceBoards(
        currentWorkspaceId
      );

      setBoards(boardsResponse.boards || []);
    } catch (err) {
      console.error("Fetch boards error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load boards"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [boardId]);

  const handleBoardClick = (selectedBoardId) => {
    navigate(`/boards/${selectedBoardId}`);
  };

  const handleCreateBoard = () => {
    console.log(
      "Create board for workspace:",
      workspaceId
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Navbar */}
      <Navbar
        onMenuClick={() =>
          setSidebarOpen((prev) => !prev)
        }
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main */}
      <Box
        component="main"
        sx={{
          mt: "72px",
          ml: sidebarOpen ? "256px" : "72px",
          minHeight: "calc(100vh - 72px)",
          p: 3,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#3F342C",
              }}
            >
              My Boards
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Manage and collaborate on your workspace boards
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateBoard}
            sx={{
              backgroundColor: "#A9744F",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#8B5E3C",
              },
            }}
          >
            Create Board
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CircularProgress
              sx={{ color: "#A9744F" }}
            />
          </Box>
        ) : boards.length === 0 ? (
          /* No boards */
          <Box
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#3F342C",
              }}
            >
              No boards found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Create your first board to get started.
            </Typography>
          </Box>
        ) : (
          /* Boards */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {boards.map((board) => (
              <Card
                key={board._id}
                onClick={() =>
                  handleBoardClick(board._id)
                }
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  border: "1px solid #E8E3DE",
                  boxShadow: "none",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    borderColor: "#A9744F",
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 8px 20px rgba(63, 52, 44, 0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#3F342C",
                    }}
                  >
                    {board.name}
                  </Typography>

                  {board.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        displayadd: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {board.description}
                    </Typography>
                  )}

                  {board.createdBy && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 2,
                      }}
                    >
                      Created by{" "}
                      {board.createdBy.name ||
                        board.createdBy.email ||
                        "Unknown"}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BoardDetail;
