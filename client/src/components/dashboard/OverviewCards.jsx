import { useEffect, useState } from "react";
import { Grid, Alert, Box, CircularProgress } from "@mui/material";

import OverviewCard from "./OverviewCard";

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

import { getWorkspaceStats } from "../../api/boardApi";

const EMPTY_STATS = {
  totalBoards: 0,
  totalCards: 0,
  totalMembers: 0,
};

const OverviewCards = ({ workspaceId }) => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      if (!workspaceId) {
        setStats(EMPTY_STATS);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getWorkspaceStats(workspaceId);

        // Support common API response wrappers.
        const data = response?.data ?? response;

        if (!cancelled) {
          setStats({
            totalBoards: Number(data?.totalBoards ?? 0),
            totalCards: Number(data?.totalCards ?? 0),
            totalMembers: Number(data?.totalMembers ?? 0),
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);

        if (!cancelled) {
          setStats(EMPTY_STATS);
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return (
    <Box sx={{ mb: 3 }}>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <OverviewCard
            title="Total Boards"
            value={loading ? "..." : stats.totalBoards}
            icon={<ViewKanbanIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <OverviewCard
            title="Total Cards"
            value={loading ? "..." : stats.totalCards}
            icon={<AssignmentIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <OverviewCard
            title="Members"
            value={loading ? "..." : stats.totalMembers}
            icon={<PeopleIcon />}
          />
        </Grid>
      </Grid>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <CircularProgress
            size={22}
            sx={{ color: "#A9744F" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default OverviewCards;