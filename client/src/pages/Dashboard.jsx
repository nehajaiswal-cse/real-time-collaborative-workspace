
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
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import WelcomeHeader from "../components/dashboard/WelcomeHeader.jsx";
import OverviewCards from "../components/dashboard/OverviewCards.jsx";
import BoardsSection from "../components/dashboard/BoardsSection.jsx";
import RecentActivity from "../components/dashboard/RecentActivity";
import WorkspaceChat from "../components/chat/WorkspaceChat";

import { useWorkspace } from "../context/workspaceContext";
import { getWorkspaceBoards } from "../api/boardApi";

import { createWorkspace } from "../api/workspaceApi";

import { getActivities } from "../api/activityApi.js";
import { createBoard } from "../services/boardService";

const Dashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // GENERAL STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");

  const {
    selectedWorkspace,
    workspaces,
    loading: workspacesLoading,
    loadWorkspaces,
  } = useWorkspace();

  const workspaceId = selectedWorkspace?._id || selectedWorkspace?.id;
  const [boardsLoading, setBoardsLoading] = useState(false);
  // =====================================================
  // USER
  // =====================================================

  const [user] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  // =====================================================
  // CREATE WORKSPACE
  // =====================================================

  const [createWorkspaceOpen, setCreateWorkspaceOpen] =
    useState(false);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [creatingWorkspace, setCreatingWorkspace] =
    useState(false);

  // =====================================================
  // CREATE BOARD
  // =====================================================

  const [createBoardOpen, setCreateBoardOpen] =
    useState(false);

  const [newBoardName, setNewBoardName] =
    useState("");

  const [creating, setCreating] = useState(false);

  // =====================================================
  // MENU
  // =====================================================

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  // =====================================================
  // LOAD BOARDS FOR THE SELECTED WORKSPACE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadBoards = async () => {
      if (!workspaceId) {
        setBoards([]);
        setBoardsLoading(false);
        return;
      }

      setBoards([]);
      setBoardsLoading(true);
      setError("");

      try {
        const response = await getWorkspaceBoards(workspaceId);
        const result = response?.data ?? response;

        const workspaceBoards = Array.isArray(result)
          ? result
          : Array.isArray(result?.boards)
            ? result.boards
            : Array.isArray(result?.data?.boards)
              ? result.data.boards
              : [];

        if (!cancelled) {
          setBoards(workspaceBoards);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load workspace boards:", err);
          setBoards([]);
          setError(
            err.response?.data?.message ||
            "Unable to load boards for this workspace."
          );
        }
      } finally {
        if (!cancelled) {
          setBoardsLoading(false);
        }
      }
    };

    loadBoards();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  // =====================================================
  // LOAD RECENT ACTIVITY FOR THE SELECTED WORKSPACE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadRecentActivity = async () => {
      if (!workspaceId) {
        setActivities([]);
        return;
      }

      setActivities([]);

      try {
        const data = await getActivities(workspaceId);
        const activityList = Array.isArray(data) ? data : [];

        const recentActivities = activityList
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt || 0).getTime() -
              new Date(a.createdAt || a.updatedAt || 0).getTime()
          )
          .slice(0, 5);

        if (!cancelled) {
          setActivities(recentActivities);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load recent activities:", err);
          setActivities([]);
        }
      }
    };

    loadRecentActivity();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  // =====================================================
  // CREATE WORKSPACE
  // =====================================================

  const handleCreateWorkspace = async (event) => {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name || creatingWorkspace) return;

    setCreatingWorkspace(true);
    setError("");

    try {
      const workspace =
        await createWorkspace({
          name,
        });

      if (
        !workspace?._id &&
        !workspace?.id
      ) {
        throw new Error(
          "The server did not return the created workspace."
        );
      }

      const newWorkspaceId = String(workspace._id || workspace.id);

      // Select the newly created workspace through shared context.
      localStorage.setItem("selectedWorkspaceId", newWorkspaceId);
      await loadWorkspaces();

      // Clear form
      setWorkspaceName("");

      // Close dialog
      setCreateWorkspaceOpen(false);
    } catch (err) {
      console.error(
        "Failed to create workspace:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create workspace."
      );
    } finally {
      setCreatingWorkspace(false);
    }
  };

  // =====================================================
  // CREATE BOARD
  // =====================================================

  const handleCreateBoard = () => {
    setError("");
    setNewBoardName("");
    setCreateBoardOpen(true);
  };

  const handleCreateBoardSubmit = async (
    event
  ) => {
    event.preventDefault();

    const boardName =
      newBoardName.trim();

    if (!boardName || creating) return;

    // Don't automatically create workspace
    if (!workspaceId) {
      setError(
        "Please create a workspace first."
      );
      return;
    }

    setCreating(true);
    setError("");

    try {
      const newBoard =
        await createBoard(
          boardName,
          workspaceId
        );

      if (
        !newBoard?._id &&
        !newBoard?.id
      ) {
        throw new Error(
          "The server did not return the created board."
        );
      }

      setBoards((previousBoards) => [
        newBoard,
        ...previousBoards,
      ]);

      setNewBoardName("");
      setCreateBoardOpen(false);
    } catch (err) {
      console.error(
        "Failed to create board:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create board. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // BOARD ACTIONS
  // =====================================================

  const handleViewAll = () => {
    navigate("/myboards");
  };

  const handleOpenBoard = (board) => {
    const boardId =
      board?._id || board?.id;

    if (!boardId) {
      setError(
        "Unable to open this board because its ID is missing."
      );
      return;
    }

    navigate(`/boards/${boardId}`);
  };

  // =====================================================
  // USER NAME
  // =====================================================

  const userName =
    user?.name || "User";

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        color: "#1F2937",
      }}
    >
      {/* NAVBAR */}

      <Navbar
        onMenuClick={handleMenuClick}
      />

      {/* SIDEBAR */}

      <Sidebar open={sidebarOpen} />

      {/* MAIN CONTENT */}

      <Box
        component="main"
        sx={{
          p: 3,
          mt: "72px",
          ml: sidebarOpen
            ? "256px"
            : "72px",
          minHeight:
            "calc(100vh - 72px)",
          boxSizing: "border-box",
          overflowX: "hidden",
          transition:
            "margin-left 0.3s ease",
        }}
      >
        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            NO WORKSPACE
        ================================================= */}

        {!workspacesLoading &&
          workspaces.length === 0 ? (
          <Box
            sx={{
              minHeight:
                "calc(100vh - 150px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            <Paper
              component="form"
              onSubmit={
                handleCreateWorkspace
              }
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                bgcolor:
                  "transparent",
              }}
            >
              {/* ICON */}

              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 3,
                  borderRadius:
                    "18px",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  background:
                    "linear-gradient(135deg, #A9744F, #3F342C)",
                  boxShadow:
                    "0 12px 25px rgba(169,116,79,0.20)",
                }}
              >
                <ViewKanbanIcon
                  sx={{
                    fontSize: 45,
                    color: "#FFFFFF",
                  }}
                />
              </Box>

              {/* TITLE */}

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#3F342C",
                  mb: 1,
                }}
              >
                Welcome to Flowboard
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                sx={{
                  color: "#77716C",
                  fontSize: 16,
                  lineHeight: 1.6,
                  mb: 3.5,
                }}
              >
                Create a workspace to
                start organizing your
                team's projects with
                Kanban boards.
              </Typography>

              {/* INPUT */}

              <TextField
                fullWidth
                placeholder="Workspace name"
                value={workspaceName}
                onChange={(event) =>
                  setWorkspaceName(
                    event.target.value
                  )
                }
                disabled={
                  creatingWorkspace
                }
                inputProps={{
                  maxLength: 100,
                }}
                sx={{
                  mb: 1.5,

                  "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "12px",
                    bgcolor:
                      "#FFFFFF",

                    "& fieldset": {
                      borderColor:
                        "#E8E3DE",
                    },

                    "&:hover fieldset":
                    {
                      borderColor:
                        "#A9744F",
                    },

                    "&.Mui-focused fieldset":
                    {
                      borderColor:
                        "#A9744F",
                    },
                  },
                }}
              />

              {/* CREATE */}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={
                  creatingWorkspace ||
                  !workspaceName.trim()
                }
                startIcon={
                  creatingWorkspace ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color:
                          "#FFFFFF",
                      }}
                    />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  height: 50,
                  borderRadius:
                    "12px",
                  textTransform:
                    "none",
                  fontSize: 16,
                  fontWeight: 600,
                  bgcolor:
                    "#A9744F",
                  boxShadow:
                    "none",

                  "&:hover": {
                    bgcolor:
                      "#8F5E3D",
                    boxShadow:
                      "0 6px 15px rgba(169,116,79,0.25)",
                  },
                }}
              >
                {creatingWorkspace
                  ? "Creating workspace..."
                  : "Create workspace"}
              </Button>
            </Paper>
          </Box>
        ) : (
          /* =================================================
             NORMAL DASHBOARD
          ================================================= */

          <>
            {/* HEADER + CREATE WORKSPACE */}

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <WelcomeHeader
                  userName={
                    userName
                  }
                />
              </Box>

              {/* CREATE WORKSPACE BUTTON */}

              <Button
                variant="contained"
                startIcon={
                  <AddIcon />
                }
                onClick={() => {
                  setWorkspaceName(
                    ""
                  );
                  setCreateWorkspaceOpen(
                    true
                  );
                }}
                sx={{
                  bgcolor:
                    "#A9744F",
                  textTransform:
                    "none",
                  fontWeight: 600,
                  borderRadius:
                    "10px",
                  px: 2.5,
                  whiteSpace:
                    "nowrap",

                  "&:hover": {
                    bgcolor:
                      "#8F5E3D",
                  },
                }}
              >
                Create Workspace
              </Button>
            </Box>

            {/* OVERVIEW */}
            <OverviewCards workspaceId={workspaceId} />

            {/* BOARDS */}

            <BoardsSection
              boards={boards}
              loading={boardsLoading}
              onCreateBoard={
                handleCreateBoard
              }
              onViewAll={
                () => navigate("/myboards")
              }
              onOpenBoard={
                handleOpenBoard
              }
            />

            {/* CHAT */}

            {workspaceId && (
              <Box
                sx={{ mt: 3 }}
              >
                <WorkspaceChat
                  workspaceId={
                    workspaceId
                  }
                />
              </Box>
            )}

            {/* ACTIVITY */}

            <RecentActivity
              activities={
                activities
              }
            />
          </>
        )}
      </Box>

      {/* =================================================
          CREATE WORKSPACE DIALOG
      ================================================= */}

      <Dialog
        open={
          createWorkspaceOpen
        }
        onClose={() => {
          if (
            !creatingWorkspace
          ) {
            setCreateWorkspaceOpen(
              false
            );
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box
          component="form"
          onSubmit={
            handleCreateWorkspace
          }
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
            }}
          >
            Create Workspace
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              required
              label="Workspace Name"
              placeholder="e.g. My Team"
              value={
                workspaceName
              }
              onChange={(event) =>
                setWorkspaceName(
                  event.target.value
                )
              }
              margin="normal"
              inputProps={{
                maxLength: 100,
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2,
            }}
          >
            <Button
              onClick={() =>
                setCreateWorkspaceOpen(
                  false
                )
              }
              disabled={
                creatingWorkspace
              }
              sx={{
                color:
                  "#6B7280",
                textTransform:
                  "none",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                creatingWorkspace ||
                !workspaceName.trim()
              }
              sx={{
                bgcolor:
                  "#A9744F",
                textTransform:
                  "none",
                fontWeight: 600,

                "&:hover": {
                  bgcolor:
                    "#8F5E3D",
                },
              }}
            >
              {creatingWorkspace
                ? "Creating..."
                : "Create Workspace"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* =================================================
          CREATE BOARD DIALOG
      ================================================= */}

      <Dialog
        open={createBoardOpen}
        onClose={() => {
          if (!creating) {
            setCreateBoardOpen(
              false
            );
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box
          component="form"
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
              required
              label="Board Name"
              value={
                newBoardName
              }
              onChange={(event) =>
                setNewBoardName(
                  event.target.value
                )
              }
              margin="normal"
              inputProps={{
                maxLength: 100,
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2,
            }}
          >
            <Button
              onClick={() =>
                setCreateBoardOpen(
                  false
                )
              }
              disabled={creating}
              sx={{
                color:
                  "#77716C",
                textTransform:
                  "none",
              }}
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
                bgcolor:
                  "#A9744F",
                textTransform:
                  "none",

                "&:hover": {
                  bgcolor:
                    "#8F5E3D",
                },
              }}
            >
              {creating
                ? "Creating..."
                : "Create Board"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dashboard;