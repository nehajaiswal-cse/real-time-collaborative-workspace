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
} from "@mui/material";

import {
  Dashboard,
  ViewKanban,
  Person,
  Groups,
  History,
  Settings,
  Logout,
} from "@mui/icons-material";

const PRIMARY_COLOR = "#A9744F";
const TEXT_COLOR = "#5F5A55";

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      name: "Profile",
      icon: <Person />,
      path: "/profile",
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

    navigate("/login");
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
      {/* Workspace */}
      <Box sx={{ px: 1.5, py: 3 }}>
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
            const isActive = location.pathname === item.path;

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
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: "48px",
                      px: open ? 1.5 : 0,
                      justifyContent: open ? "initial" : "center",

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

      {/* Push Logout to Bottom */}
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
              startIcon={open ? <Logout /> : null}
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

                "& .MuiButton-startIcon": {
                  marginLeft: 0,
                  marginRight: open ? 12 : 0,
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