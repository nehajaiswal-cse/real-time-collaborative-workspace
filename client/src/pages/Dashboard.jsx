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

import {
  getDashboardData,
  getBoards,
} from "../api/dashboardApi";

import {
  getMyWorkspaces,
  createWorkspace,
} from "../api/workspaceApi";

import { createBoard } from "../services/boardService";

const Dashboard = () => {
  const navigate = useNavigate();

  // -----------------------------
  // GENERAL STATE
  // -----------------------------
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  const [activeWorkspaceId, setActiveWorkspaceId] =
    useState("");

  const [loadingBoards, setLoadingBoards] =
    useState(true);

  const [error, setError] = useState("");

  // -----------------------------
  // USER
  // -----------------------------
  const [user] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  });

  // -----------------------------
  // CREATE WORKSPACE
  // -----------------------------
  const [createWorkspaceOpen, setCreateWorkspaceOpen] =
    useState(false);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [creatingWorkspace, setCreatingWorkspace] =
    useState(false);

  // -----------------------------
  // CREATE BOARD
  // -----------------------------
  const [createBoardOpen, setCreateBoardOpen] =
    useState(false);

  const [newBoardName, setNewBoardName] =
    useState("");

  const [creating, setCreating] = useState(false);

  // -----------------------------
  // MENU
  // -----------------------------
  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  // =====================================================
  // LOAD WORKSPACES + BOARDS
  // =====================================================
  useEffect(() => {
    let cancelled = false;

    const loadWorkspaceAndBoards = async () => {
      setLoadingBoards(true);
      setError("");

      try {
        const workspaceList =
          await getMyWorkspaces();

        const validWorkspaces = Array.isArray(
          workspaceList
        )
          ? workspaceList
          : [];

        if (cancelled) return;

        setWorkspaces(validWorkspaces);

        // ---------------------------------------------
        // NO WORKSPACE
        // ---------------------------------------------
        if (validWorkspaces.length === 0) {
          setActiveWorkspaceId("");
          setBoards([]);
          return;
        }

        // ---------------------------------------------
        // SELECT FIRST WORKSPACE
        // ---------------------------------------------
        const workspaceId =
          validWorkspaces[0]?._id ||
          validWorkspaces[0]?.id ||
          "";

        setActiveWorkspaceId(workspaceId);

        if (!workspaceId) {
          setBoards([]);
          return;
        }

        // ---------------------------------------------
        // LOAD BOARDS
        // ---------------------------------------------
        const boardList =
          await getBoards(workspaceId);

        if (!cancelled) {
          setBoards(
            Array.isArray(boardList)
              ? boardList
              : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to load workspaces and boards:",
            err
          );

          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your workspace."
          );
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

  // =====================================================
  // LOAD ACTIVITY
  // =====================================================
  useEffect(() => {
    let cancelled = false;

    const loadActivity = async () => {
      try {
        const data =
          await getDashboardData();

        if (!cancelled) {
          setActivities(
            data?.activities || []
          );
        }
      } catch (err) {
        console.error(
          "Failed to load dashboard activity:",
          err
        );

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

  // =====================================================
  // CREATE WORKSPACE
  // =====================================================
  const handleCreateWorkspace = async (
    event
  ) => {
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

      const workspaceId =
        workspace._id ||
        workspace.id;

      // Add newly created workspace
      setWorkspaces((previous) => [
        workspace,
        ...previous,
      ]);

      // Make new workspace active
      setActiveWorkspaceId(
        workspaceId
      );

      // Load boards of new workspace
      const boardList =
        await getBoards(workspaceId);

      setBoards(
        Array.isArray(boardList)
          ? boardList
          : []
      );

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
    if (!activeWorkspaceId) {
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
          activeWorkspaceId
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
        {!loadingBoards &&
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
                    "linear-gradient(135deg, #3B82F6, #14B8A6)",
                  boxShadow:
                    "0 12px 25px rgba(59,130,246,0.20)",
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
                  color: "#172033",
                  mb: 1,
                }}
              >
                Welcome to Flowboard
              </Typography>

              {/* DESCRIPTION */}
              <Typography
                sx={{
                  color: "#718096",
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
                          "#D7DEE8",
                      },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#3B82F6",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "#3B82F6",
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
                    "#3B82F6",
                  boxShadow:
                    "none",

                  "&:hover": {
                    bgcolor:
                      "#2563EB",
                    boxShadow:
                      "0 6px 15px rgba(59,130,246,0.25)",
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
                    "#3B82F6",
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
                      "#2563EB",
                  },
                }}
              >
                Create Workspace
              </Button>
            </Box>

            {/* OVERVIEW */}
            <OverviewCards />

            {/* BOARDS */}
            <BoardsSection
              boards={boards}
              loading={
                loadingBoards
              }
              onCreateBoard={
                handleCreateBoard
              }
              onViewAll={
                handleViewAll
              }
              onOpenBoard={
                handleOpenBoard
              }
            />

            {/* CHAT */}
            {activeWorkspaceId && (
              <Box
                sx={{ mt: 3 }}
              >
                <WorkspaceChat
                  workspaceId={
                    activeWorkspaceId
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
                  "#3B82F6",
                textTransform:
                  "none",
                fontWeight: 600,

                "&:hover": {
                  bgcolor:
                    "#2563EB",
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
                  "#3B82F6",
                textTransform:
                  "none",

                "&:hover": {
                  bgcolor:
                    "#2563EB",
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