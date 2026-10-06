
import { Box, Button, Typography } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/History";
import RefreshOutlinedIcon from "@mui/icons-material/Refresh";

const ActivityHeader = ({ onRefresh, loading = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryOutlinedIcon sx={{ color: "#A9744F", fontSize: 30 }} />

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "#3F342C",
              fontSize: { xs: 25, sm: 30 },
            }}
          >
            Activity
          </Typography>
        </Box>

        <Typography sx={{ mt: 1, color: "#77716C", fontSize: 14 }}>
          Keep track of your workspace activities and updates.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<RefreshOutlinedIcon />}
        onClick={onRefresh}
        disabled={loading}
        sx={{
          borderColor: "#A9744F",
          color: "#A9744F",
          textTransform: "none",
          borderRadius: 2,
          "&:hover": {
            borderColor: "#8B5E3C",
            backgroundColor: "#F9F3EE",
          },
        }}
      >
        {loading ? "Refreshing..." : "Refresh"}
      </Button>
    </Box>
  );
};

export default ActivityHeader;