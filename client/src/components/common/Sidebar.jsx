import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import Dashboard from "@mui/icons-material/Dashboard";
import ViewKanban from "@mui/icons-material/ViewKanban";
import Groups from "@mui/icons-material/Groups";
import History from "@mui/icons-material/History";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Business from "@mui/icons-material/Business";

import { useState } from "react";
import { useWorkspace } from "../../context/workspaceContext";

const PRIMARY_COLOR = "#A9744F";
const TEXT_COLOR = "#5F5A55";

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    workspaces,
    selectedWorkspace,
    loading,
    switchWorkspace,
  } = useWorkspace();

  const [workspaceAnchor, setWorkspaceAnchor] =
    useState(null);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      name: "My Boards",
      icon: <ViewKanban />,
      path: "/myboards",
    },
    {
      name: "Members",
      icon: <Groups />,
      path: "/members",
    },
    {
      name: "Activity",
      icon: <History />,
      path: "/activity",
    },
    {
      name: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedWorkspace");

    navigate("/login");
  };

  const handleWorkspaceClick = (event) => {
    setWorkspaceAnchor(event.currentTarget);
  };

  const handleWorkspaceSelect = (workspace) => {
    switchWorkspace(workspace);
    setWorkspaceAnchor(null);
  };

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        top: "72px",
        left: 0,
        bottom: 0,

        width: open ? "256px" : "72px",

        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",

        display: "flex",
        flexDirection: "column",

        transition: "width 0.3s ease",

        overflowY: "auto",
        overflowX: "hidden",

        zIndex: (theme) => theme.zIndex.drawer,

        "&::-webkit-scrollbar": {
          width: "5px",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d6c4b7",
          borderRadius: "10px",
        },
      }}
    >
      {/* ================================= */}
      {/* WORKSPACE SELECTOR */}
      {/* ================================= */}

      <Box sx={{ px: 1.5, pt: 2.5, pb: 1 }}>
        {open && (
          <Typography
            sx={{
              px: 1.5,
              mb: 1,
              fontSize: "11px",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Workspace
          </Typography>
        )}

        <Tooltip
          title={
            !open
              ? selectedWorkspace?.name ||
                "Workspace"
              : ""
          }
          placement="right"
          arrow
        >
          <Button
            fullWidth
            onClick={handleWorkspaceClick}
            disabled={loading}
            sx={{
              minHeight: "48px",

              justifyContent: open
                ? "flex-start"
                : "center",

              px: open ? 1.5 : 0,

              borderRadius: "12px",

              backgroundColor: "#faf7f5",

              color: TEXT_COLOR,

              textTransform: "none",

              border: "1px solid #eee5df",

              "&:hover": {
                backgroundColor: "#f5eee9",
                borderColor: "#d6c4b7",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={20}
                sx={{
                  color: PRIMARY_COLOR,
                }}
              />
            ) : (
              <>
                <Business
                  sx={{
                    fontSize: "22px",
                    color: PRIMARY_COLOR,
                    mr: open ? 1.5 : 0,
                  }}
                />

                {open && (
                  <>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {selectedWorkspace?.name ||
                          "No Workspace"}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: "#9ca3af",
                        }}
                      >
                        Current workspace
                      </Typography>
                    </Box>

                    <KeyboardArrowDown
                      sx={{
                        fontSize: "20px",
                        color: "#9ca3af",
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Button>
        </Tooltip>

        {/* ================================= */}
        {/* WORKSPACE MENU */}
        {/* ================================= */}

        <Menu
          anchorEl={workspaceAnchor}
          open={Boolean(workspaceAnchor)}
          onClose={() => setWorkspaceAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: "230px",
              borderRadius: "12px",
              border: "1px solid #eee5df",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Typography
            sx={{
              px: 2,
              py: 1,
              fontSize: "11px",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Switch Workspace
          </Typography>

          <Divider />

          {workspaces.length === 0 ? (
            <MenuItem disabled>
              No workspaces found
            </MenuItem>
          ) : (
            workspaces.map((workspace) => (
              <MenuItem
                key={workspace._id}
                selected={
                  selectedWorkspace?._id ===
                  workspace._id
                }
                onClick={() =>
                  handleWorkspaceSelect(workspace)
                }
              >
                <ListItemIcon
                  sx={{
                    minWidth: "36px",
                    color:
                      selectedWorkspace?._id ===
                      workspace._id
                        ? PRIMARY_COLOR
                        : TEXT_COLOR,
                  }}
                >
                  <Business fontSize="small" />
                </ListItemIcon>

                <ListItemText
                  primary={workspace.name}
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight:
                      selectedWorkspace?._id ===
                      workspace._id
                        ? 600
                        : 400,
                  }}
                />
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>

      <Divider sx={{ borderColor: "#f0f0f0" }} />

      {/* ================================= */}
      {/* NAVIGATION */}
      {/* ================================= */}

      <Box sx={{ px: 1.5, py: 2 }}>
        {open && (
          <Typography
            sx={{
              px: 1.5,
              mb: 2,
              fontSize: "11px",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Workspace
          </Typography>
        )}

        <List disablePadding>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path;

            return (
              <ListItem
                key={item.name}
                disablePadding
                sx={{ mb: 1 }}
              >
                <Tooltip
                  title={!open ? item.name : ""}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() =>
                      navigate(item.path)
                    }
                    sx={{
                      minHeight: "48px",

                      px: open ? 1.5 : 0,

                      justifyContent: open
                        ? "initial"
                        : "center",

                      borderRadius: "12px",

                      color: isActive
                        ? "#ffffff"
                        : TEXT_COLOR,

                      backgroundColor: isActive
                        ? PRIMARY_COLOR
                        : "transparent",

                      boxShadow: isActive
                        ? "0 2px 6px rgba(169, 116, 79, 0.25)"
                        : "none",

                      transition: "all 0.2s ease",

                      "&:hover": {
                        backgroundColor: isActive
                          ? PRIMARY_COLOR
                          : "rgba(169, 116, 79, 0.10)",

                        color: isActive
                          ? "#ffffff"
                          : PRIMARY_COLOR,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1.5 : 0,
                        justifyContent: "center",
                        color: "inherit",

                        "& svg": {
                          fontSize: "22px",
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontSize: "14px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* ================================= */}
      {/* LOGOUT */}
      {/* ================================= */}

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "#f0f0f0" }} />

        <Box sx={{ p: 1.5 }}>
          <Tooltip
            title={!open ? "Logout" : ""}
            placement="right"
            arrow
          >
            <Button
              fullWidth
              onClick={handleLogout}
              startIcon={
                open ? <Logout /> : null
              }
              sx={{
                minHeight: "48px",

                justifyContent: open
                  ? "flex-start"
                  : "center",

                px: open ? 1.5 : 0,

                borderRadius: "12px",

                color: TEXT_COLOR,

                textTransform: "none",

                fontSize: "14px",

                fontWeight: 500,

                "&:hover": {
                  backgroundColor: "#fff5f5",
                  color: "#ef4444",
                },
              }}
            >
              {!open && <Logout />}

              {open && "Logout"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;