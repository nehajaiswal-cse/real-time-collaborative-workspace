import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsCard from "./SettingsCard.jsx";

const ProfileSettings = ({ user, loading, error }) => {
  const name = user?.name || "";
  const email = user?.email || "";
  const avatar = user?.avatar || "";
  const role = user?.role || "";

  const formattedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "";

  return (
    <SettingsCard
      icon={PersonOutlineOutlinedIcon}
      title="Profile"
      subtitle="Your account information"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2.5}
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#FFFCFA",
              minWidth: 0,
            }}
          >
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                bgcolor: "#A9744F",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#3F342C",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name || "Name not available"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "#77716C",
                  overflowWrap: "anywhere",
                }}
              >
                {email || "Email not available"}
              </Typography>

              {formattedRole && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-block",
                    mt: 0.5,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: "#F2E8E0",
                    color: "#8B5E3C",
                    fontWeight: 600,
                  }}
                >
                  {formattedRole}
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={name}
              fullWidth
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Email address"
              value={email}
              fullWidth
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
          </Stack>

          <Alert severity="info" sx={{ mt: 2.5, alignItems: "center" }}>
            Profile information is loaded from your account. Editing and saving
            profile details requires a profile-update API, which is not present
            in the current backend.
          </Alert>
        </>
      )}
    </SettingsCard>
  );
};

export default ProfileSettings;
