import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Snackbar,
} from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

import SettingsHeader from "../components/settings/SettingsHeader.jsx";
import ProfileSettings from "../components/settings/ProfileSettings.jsx";
import PreferenceSettings from "../components/settings/PreferenceSettings.jsx";
import SecuritySettings from "../components/settings/SecuritySettings.jsx";
import WorkspaceSettings from "../components/settings/WorkspaceSettings.jsx";

import {
  getCurrentUser,
  getMyWorkspaces,
} from "../api/settingsApi.js";

const PREFERENCES_KEY = "syncspace-settings-preferences";

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  workspaceNotifications: true,
};

const readPreferences = () => {
  try {
    const saved = localStorage.getItem(PREFERENCES_KEY);

    if (!saved) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(saved);

    return {
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

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");

    try {
      const result = await getCurrentUser();
      setUser(result);
    } catch (error) {
      console.error("Failed to load profile:", error);

      if (error.response?.status === 401) {
        setProfileError(
          "Your session may have expired. Please log in again."
        );
      } else if (!error.response) {
        setProfileError("Unable to load your profile right now.");
      } else {
        setProfileError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      }
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const loadWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);
    setWorkspaceError("");

    try {
      const result = await getMyWorkspaces();

      const list = Array.isArray(result)
        ? result.filter((item) => item && item._id)
        : [];

      setWorkspaces(list);

      setWorkspaceId((previousId) => {
        if (list.some((item) => item._id === previousId)) {
          return previousId;
        }

        return list[0]?._id || "";
      });
    } catch (error) {
      console.error("Failed to load workspaces:", error);

      if (error.response?.status === 401) {
        setWorkspaceError(
          "Please log in again to view your workspaces."
        );
      } else if (!error.response) {
        setWorkspaceError(
          "Unable to load your workspaces right now."
        );
      } else {
        setWorkspaceError(
          error.response?.data?.message ||
            "Unable to load workspaces."
        );
      }

      setWorkspaces([]);
      setWorkspaceId("");
    } finally {
      setWorkspaceLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadWorkspaces();
  }, [loadProfile, loadWorkspaces]);

  const handlePreferencesChange = (nextPreferences) => {
    setPreferences(nextPreferences);

    try {
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify(nextPreferences)
      );

      setNoticeOpen(true);
    } catch (error) {
      console.error("Unable to save preferences:", error);
    }
  };

  const refreshSettings = () => {
    loadProfile();
    loadWorkspaces();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAF8F6",
      }}
    >
      <Navbar
        onMenuClick={() =>
          setSidebarOpen((previous) => !previous)
        }
      />

      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          mt: "72px",
          ml: {
            xs: "72px",
            md: sidebarOpen ? "256px" : "72px",
          },
          p: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },
          minHeight: "calc(100vh - 72px)",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <SettingsHeader />

            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={refreshSettings}
              sx={{
                borderColor: "#A9744F",
                color: "#A9744F",
                textTransform: "none",
                borderRadius: 2,
                px: 1.5,
                flexShrink: 0,
                "&:hover": {
                  borderColor: "#8B5E3C",
                  bgcolor: "rgba(169,116,79,0.08)",
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* Settings cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: {
                xs: 2,
                md: 2.5,
              },
              alignItems: "start",

              "& > *": {
                minWidth: 0,
              },

              "& .MuiPaper-root": {
                borderRadius: 3,
              },
            }}
          >
            <ProfileSettings
              user={user}
              loading={profileLoading}
              error={profileError}
            />

            <PreferenceSettings
              preferences={preferences}
              onChange={handlePreferencesChange}
            />

            <SecuritySettings />

            <WorkspaceSettings
              workspaces={workspaces}
              workspaceId={workspaceId}
              onWorkspaceChange={setWorkspaceId}
              loading={workspaceLoading}
              error={workspaceError}
            />
          </Box>

          <Box
            sx={{
              textAlign: "center",
              py: 3,
              color: "#8A817A",
            }}
          >
            <Box component="span" sx={{ fontSize: 12 }}>
              SyncSpace · Account and workspace settings
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={noticeOpen}
        autoHideDuration={2500}
        onClose={() => setNoticeOpen(false)}
        message="Notification preferences saved."
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </Box>
  );
};

export default Settings;