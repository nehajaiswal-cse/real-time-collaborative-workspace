import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsCard from "./SettingsCard.jsx";

const panelSx = {
  p: 2.5,
  border: "1px solid #E8E3DE",
  borderRadius: 2,
};

const SecuritySettings = () => {
  const hasToken = Boolean(localStorage.getItem("token"));

  return (
    <SettingsCard
      icon={ShieldOutlinedIcon}
      title="Security"
      subtitle="Manage your account security"
    >
      <Box
        sx={{
          ...panelSx,
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          bgcolor: "#FFFCFA",
        }}
      >
        <VerifiedUserOutlinedIcon
          sx={{ color: hasToken ? "#4E8B57" : "#A9744F", fontSize: 30 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: hasToken ? "#4E8B57" : "#A9744F",
              }}
            />
            <Typography sx={{ fontWeight: 600, color: "#3F342C" }}>
              {hasToken ? "Active session" : "Session unavailable"}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#77716C" }}>
            {hasToken
              ? "Your account is securely signed in."
              : "Please sign in to access your account."}
          </Typography>
        </Box>
      </Box>

      <Box sx={panelSx}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LockOutlinedIcon sx={{ color: "#A9744F" }} />
          <Typography sx={{ fontWeight: 600, color: "#3F342C" }}>
            Change password
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "#77716C" }}>
          Password changes are not yet connected to the backend.
        </Typography>
        <Button
          variant="outlined"
          disabled
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Change password
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 2.5, alignItems: "center" }}>
        Missing API: the current backend does not expose a password-change
        endpoint. Your backend team will need to implement one before this
        action can be enabled.
      </Alert>
    </SettingsCard>
  );
};

export default SecuritySettings;
