
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Typography,
} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import ActivityHeader from "../components/activity/ActivityHeader.jsx";
import ActivityFilters from "../components/activity/ActivityFilters.jsx";
import ActivityList from "../components/activity/ActivityList.jsx";
import { getActivities } from "../api/activityApi.js";
import { useWorkspace } from "../context/workspaceContext.jsx";

const Activity = () => {
    const { selectedWorkspace } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
     if (!selectedWorkspace?._id) {
    setActivities([]);
    setLoading(false);
    return;
  }
    setLoading(true);
    setError("");

    try {
      const data = await getActivities(selectedWorkspace._id);
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setActivities([]);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 404) {
        setError(
          "The activity API is not available yet. Please ask your backend team to implement GET /api/activity."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load activities. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selectedWorkspace?._id]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityType = String(activity.type || "").toLowerCase();

      const matchesType =
        type === "all" || activityType.includes(type);

      const searchableText = [
        activity.message,
        activity.description,
        activity.action,
        activity.type,
        activity.user?.name,
        activity.actor?.name,
        activity.userName,
        activity.board?.name,
        activity.boardName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.trim().toLowerCase()
      );

      return matchesType && matchesSearch;
    });
  }, [activities, search, type]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        color: "#3F342C",
      }}
    >
      <Navbar
        onMenuClick={() => setSidebarOpen((previous) => !previous)}
      />

      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          ml: sidebarOpen ? "256px" : "72px",
          mt: "72px",
          p: { xs: 2, md: 3 },
          minHeight: "calc(100vh - 72px)",
          boxSizing: "border-box",
          transition: "margin-left 0.3s ease",
        }}
      >
        <ActivityHeader
          onRefresh={loadActivities}
          loading={loading}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: "#77716C",
              fontSize: 14,
            }}
          >
            {loading
              ? "Loading activities..."
              : `${filteredActivities.length} ${
                  filteredActivities.length === 1
                    ? "activity"
                    : "activities"
                }`}
          </Typography>
        </Box>

        <ActivityFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
        />

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Typography
                component="button"
                onClick={loadActivities}
                sx={{
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Retry
              </Typography>
            }
          >
            {error}
          </Alert>
        )}

        <ActivityList
          activities={filteredActivities}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default Activity;