import {
  Box,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
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
    description: "Preference for receiving email updates.",
  },
  {
    key: "workspaceNotifications",
    title: "Workspace notifications",
    description: "Preference for workspace activity updates.",
  },
];

const PreferenceSettings = ({ preferences, onChange }) => {
  const updatePreference = (key, value) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <SettingsCard
      icon={PaletteOutlinedIcon}
      title="Preferences"
      subtitle="Customize your SyncSpace experience"
    >
      

      <Divider sx={{ borderColor: "#F0EBE7" }} />

      {/* NOTIFICATIONS */}
      <Box>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mb: 1 }}
        >
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
              checked={Boolean(preferences[item.key])}
              onChange={(event) =>
                updatePreference(item.key, event.target.checked)
              }
              sx={switchSx}
            />
          </Box>
        ))}
      </Box>

      {/* FOOTNOTE */}
      <Typography
        variant="caption"
        sx={{ display: "block", color: "#77716C", lineHeight: 1.6 }}
      >
        Preferences are saved in this browser. Notification switches store
        your choices; they do not send or suppress actual notifications
        unless notification delivery is connected to the backend.
      </Typography>
    </SettingsCard>
  );
};

export default PreferenceSettings;