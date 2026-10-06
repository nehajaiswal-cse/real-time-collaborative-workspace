import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

import SettingsHeader from "../components/settings/SettingsHeader.jsx";
import ProfileSettings from "../components/settings/ProfileSettings.jsx";
import PreferenceSettings from "../components/settings/PreferenceSettings.jsx";
import SecuritySettings from "../components/settings/SecuritySettings.jsx";
import WorkspaceSettings from "../components/settings/WorkspaceSettings.jsx";

import { getCurrentUser, getMyWorkspaces } from "../api/settingsApi.js";

const PREFERENCES_KEY = "syncspace-settings-preferences";

const NAVBAR_HEIGHT = 72;
const SIDEBAR_WIDTH_OPEN = 256;
const SIDEBAR_WIDTH_CLOSED = 72;

const DEFAULT_PREFERENCES = {
  theme: "light",
  emailNotifications: true,
  workspaceNotifications: true,
};

const readPreferences = () => {
  try {
    const saved = localStorage.getItem(PREFERENCES_KEY);

    if (!saved) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(saved);

    return {
      theme:
        parsed.theme === "dark" || parsed.theme === "light"
          ? parsed.theme
          : "light",
      emailNotifications:
        typeof parsed.emailNotifications === "boolean"
          ? parsed.emailNotifications
          : true,
      workspaceNotifications:
        typeof parsed.workspaceNotifications === "boolean"
          ? parsed.workspaceNotifications
          : true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

// Shared error message resolver, removes the duplicated if/else chains.
const getErrorMessage = (error, messages) => {
  const status = error.response?.status;

  if (status === 401) return messages.unauthorized;
  if (status === 404) return messages.notFound;
  if (!error.response) {
    return "Cannot connect to the backend. Check that the server is running.";
  }

  return error.response?.data?.message || messages.fallback;
};

// Every grid cell is a flex container, so the card inside stretches
// to the full cell height and never gets clipped.
const cardSlotSx = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  "& > *": {
    flex: 1,
    minWidth: 0,
  },
};

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");

  const [profileLoading, setProfileLoading] = useState(true);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  const [profileError, setProfileError] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");

  const [preferences, setPreferences] = useState(readPreferences);
  const [noticeOpen, setNoticeOpen] = useState(false);

  // LOAD PROFILE
  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const result = await getCurrentUser();
      setUser(result);
    } catch (error) {
      console.error("Failed to load profile:", error);

      setProfileError(
        getErrorMessage(error, {
          unauthorized: "Your session may have expired. Please log in again.",
          notFound: "The profile endpoint was not found.",
          fallback: "Unable to load your profile.",
        })
      );
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // LOAD WORKSPACES
  const loadWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);
    setWorkspaceError("");

    try {
      const result = await getMyWorkspaces();
      const list = Array.isArray(result) ? result : [];

      setWorkspaces(list);

      setWorkspaceId((previousId) =>
        list.some((item) => item._id === previousId)
          ? previousId
          : list[0]?._id || ""
      );
    } catch (error) {
      console.error("Failed to load workspaces:", error);

      setWorkspaceError(
        getErrorMessage(error, {
          unauthorized: "Please log in again to view your workspaces.",
          notFound: "The workspace API endpoint was not found.",
          fallback: "Unable to load workspaces.",
        })
      );

      setWorkspaces([]);
      setWorkspaceId("");
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  // INITIAL LOAD
  useEffect(() => {
    loadProfile();
    loadWorkspaces();
  }, [loadProfile, loadWorkspaces]);

  // PREFERENCES
  const handlePreferencesChange = (nextPreferences) => {
    setPreferences(nextPreferences);

    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(nextPreferences));
      setNoticeOpen(true);
    } catch (error) {
      console.error("Unable to save preferences:", error);
    }
  };

  // REFRESH
  const refreshSettings = () => {
    loadProfile();
    loadWorkspaces();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAF8F6" }}>
      <Navbar onMenuClick={() => setSidebarOpen((previous) => !previous)} />

      <Sidebar open={sidebarOpen} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          mt: `${NAVBAR_HEIGHT}px`,
          ml: {
            xs: `${SIDEBAR_WIDTH_CLOSED}px`,
            md: sidebarOpen
              ? `${SIDEBAR_WIDTH_OPEN}px`
              : `${SIDEBAR_WIDTH_CLOSED}px`,
          },
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          transition: "margin-left 0.3s ease",
          boxSizing: "border-box",
        }}
      >
        {/* PAGE CONTAINER */}
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
          {/* PAGE HEADER */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SettingsHeader />
            </Box>

            <Button
              size="medium"
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={refreshSettings}
              sx={{
                flexShrink: 0,
                alignSelf: { xs: "flex-start", sm: "center" },
                px: 2.5,
                borderColor: "#A9744F",
                color: "#A9744F",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#8B5E3C",
                  bgcolor: "rgba(169,116,79,0.08)",
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* INFORMATION ALERT */}
          <Alert
            severity="info"
            sx={{
              mb: { xs: 3, md: 4 },
              borderRadius: 2,
              alignItems: "center",
              "& .MuiAlert-message": { py: 1 },
            }}
          >
            Profile and workspace details are loaded from your backend.
            Notification preferences are saved in this browser.
          </Alert>

          {/* SETTINGS GRID
              One column below lg, two columns from lg.
              The sidebar eats 256px at md, so a two column layout
              there leaves each card too narrow and causes the crowding.
              Rows are auto sized: min 320px, but they grow with content. */}
          <Box
            sx={{
              display: "grid",
              width: "100%",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                lg: "repeat(2, minmax(0, 1fr))",
              },
              gridAutoRows: {
                xs: "auto",
                lg: "minmax(320px, auto)",
              },
              gap: { xs: 3, md: 4 },
              alignItems: "stretch",
            }}
          >
            <Box sx={cardSlotSx}>
              <ProfileSettings
                user={user}
                loading={profileLoading}
                error={profileError}
              />
            </Box>

            <Box sx={cardSlotSx}>
              <PreferenceSettings
                preferences={preferences}
                onChange={handlePreferencesChange}
              />
            </Box>

            <Box sx={cardSlotSx}>
              <SecuritySettings />
            </Box>

            <Box sx={cardSlotSx}>
              <WorkspaceSettings
                workspaces={workspaces}
                workspaceId={workspaceId}
                onWorkspaceChange={setWorkspaceId}
                loading={workspaceLoading}
                error={workspaceError}
              />
            </Box>
          </Box>

          {/* FOOTER */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: { xs: 4, md: 6 },
              color: "#77716C",
            }}
          >
            SyncSpace · Account and workspace settings
          </Typography>
        </Box>
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={noticeOpen}
        autoHideDuration={2500}
        onClose={() => setNoticeOpen(false)}
        message="Notification preferences saved in this browser."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Settings;