import {
  Box,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const PreferenceSettings = ({ preferences, onChange }) => {
  const updatePreference = (key, value) => {
    onChange({
      ...preferences,
      [key]: value,
    });
  };

  const notificationOptions = [
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

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        border: "1px solid #E8E3DE",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <PaletteOutlinedIcon
          sx={{ color: "#A9744F", fontSize: 27 }}
        />

        <Box>
          <Typography
            fontWeight={700}
            color="#3F342C"
            fontSize={18}
          >
            Preferences
          </Typography>

          <Typography variant="body2" color="#77716C">
            Customize your SyncSpace experience
          </Typography>
        </Box>
      </Stack>

      {/* Appearance */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "#FFFCFA",
          border: "1px solid #E8E3DE",
          mb: 3,
        }}
      >
        <Typography
          fontWeight={600}
          color="#3F342C"
          mb={0.5}
        >
          Appearance
        </Typography>

        <Typography variant="body2" color="#77716C">
          SyncSpace currently uses the default light appearance.
        </Typography>
      </Box>

      {/* Notifications */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        mb={1}
      >
        <NotificationsNoneOutlinedIcon
          sx={{ color: "#A9744F", fontSize: 26 }}
        />

        <Box>
          <Typography fontWeight={600} color="#3F342C">
            Notifications
          </Typography>

          <Typography variant="body2" color="#77716C">
            Choose which notifications you want to receive.
          </Typography>
        </Box>
      </Stack>

      <Box>
        {notificationOptions.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              py: 1.8,
              borderBottom:
                index !== notificationOptions.length - 1
                  ? "1px solid #F0EBE7"
                  : "none",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={600}
                color="#3F342C"
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="#77716C"
              >
                {item.description}
              </Typography>
            </Box>

            <Switch
              checked={Boolean(preferences[item.key])}
              onChange={(event) =>
                updatePreference(
                  item.key,
                  event.target.checked
                )
              }
              sx={{
                flexShrink: 0,

                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#A9744F",
                },

                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                  {
                    backgroundColor: "#A9744F",
                  },
              }}
            />
          </Box>
        ))}
      </Box>

      <Typography
        variant="caption"
        color="#8A817A"
        display="block"
        mt={2}
      >
        Your notification preferences are saved in this browser.
      </Typography>
    </Paper>
  );
};

export default PreferenceSettings;