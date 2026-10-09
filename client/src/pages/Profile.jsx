// src/pages/Profile.jsx

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ProfileOverview from "../components/profile/ProfileOverview.jsx";
import PersonalInformation from "../components/profile/PersonalInformation.jsx";
import AccountInformation from "../components/profile/AccountInformation.jsx";

import { getCurrentUser } from "../api/settingsApi.js";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getCurrentUser();

      setUser(result);
    } catch (error) {
      console.error("Failed to load profile:", error);

      const status = error.response?.status;

      if (status === 401) {
        setError(
          "Your session may have expired. Please log in again."
        );
      } else if (status === 404) {
        setError(
          "The profile endpoint was not found."
        );
      } else if (!error.response) {
        setError(
          "Cannot connect to the backend. Check that the server is running."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleRefresh = async () => {
    await loadProfile();
    setNoticeOpen(true);
  };

  return (
    <>
      <Navbar />

      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((previous) => !previous)}
      />

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

          backgroundColor: "#FAF8F6",

          transition: "margin-left 0.3s ease",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1320px",
            mx: "auto",
          }}
        >
          {/* PAGE HEADER */}
          <ProfileHeader
            onRefresh={handleRefresh}
            loading={loading}
          />

          {/* ERROR */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "10px",
              }}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                sx={{
                  color: "#A9744F",
                }}
              />
            </Box>
          ) : user ? (
            <>
              {/* PROFILE OVERVIEW */}
              <ProfileOverview user={user} />

              {/* INFORMATION CARDS */}
              <Box
                sx={{
                  mt: 3,

                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: {
                    xs: 2.5,
                    md: 3,
                  },

                  alignItems: "stretch",

                  "& > *": {
                    minWidth: 0,
                  },
                }}
              >
                <PersonalInformation user={user} />

                <AccountInformation user={user} />
              </Box>
            </>
          ) : (
            <Alert
              severity="info"
              sx={{
                borderRadius: "10px",
              }}
            >
              No profile information is available.
            </Alert>
          )}
        </Box>
      </Box>

      <Snackbar
        open={noticeOpen}
        autoHideDuration={2500}
        onClose={() => setNoticeOpen(false)}
        message="Profile refreshed"
      />
    </>
  );
};

export default Profile;