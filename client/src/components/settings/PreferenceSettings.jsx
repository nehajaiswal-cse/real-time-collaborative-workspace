import { Box, Divider, Stack, Switch, Typography } from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsCard from "./SettingsCard.jsx";

const ACCENT = "#A9744F";

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: ACCENT,
  },
};

const NOTIFICATION_OPTIONS = [
  {
    key: "emailNotifications",
    title: "Email notifications",
    description: "Receive important updates and account emails.",
  },
  {
    key: "workspaceNotifications",
    title: "Workspace notifications",
    description: "Stay updated about activity in your workspace.",
  },
];

const PreferenceSettings = ({ preferences, onChange }) => {
  const updatePreference = (key, value) => {
    onChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <SettingsCard
      icon={PaletteOutlinedIcon}
      title="Preferences"
      subtitle="Customize your SyncSpace experience"
    >
      <Box
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 2,
          bgcolor: "#FFFCFA",
          border: "1px solid #E8E3DE",
        }}
      >
        <Typography fontWeight={600} color="#3F342C" mb={0.5}>
          Appearance
        </Typography>
        <Typography variant="body2" color="#77716C">
          SyncSpace currently uses the default light appearance.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#F0EBE7", mb: 2 }} />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <NotificationsNoneOutlinedIcon sx={{ color: ACCENT, fontSize: 26 }} />
        <Box>
          <Typography sx={{ fontWeight: 600, color: "#3F342C" }}>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.25, color: "#77716C" }}>
            Choose which notification preferences to keep enabled.
          </Typography>
        </Box>
      </Stack>

      <Box>
        {NOTIFICATION_OPTIONS.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              py: 2,
              borderBottom:
                index < NOTIFICATION_OPTIONS.length - 1
                  ? "1px solid #F0EBE7"
                  : "none",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, color: "#3F342C" }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25, color: "#77716C" }}>
                {item.description}
              </Typography>
            </Box>
            <Switch
              checked={Boolean(preferences?.[item.key])}
              onChange={(event) =>
                updatePreference(item.key, event.target.checked)
              }
              sx={switchSx}
            />
          </Box>
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 2, color: "#77716C", lineHeight: 1.6 }}
      >
        Preferences are saved in this browser. Notification switches store
        your choices; they do not send or suppress actual notifications unless
        notification delivery is connected to the backend.
      </Typography>
    </SettingsCard>
  );
};

export default PreferenceSettings;
