
import { Box, Typography } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const SettingsHeader = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "12px",
            bgcolor: "#F4EAE2",
            color: "#A9744F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SettingsOutlinedIcon fontSize="large" />
        </Box>

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "#3F342C",
              fontSize: { xs: "25px", sm: "30px" },
            }}
          >
            Settings
          </Typography>

          <Typography sx={{ color: "#77716C", mt: 0.5 }}>
            Manage your account, preferences, and workspaces.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsHeader;