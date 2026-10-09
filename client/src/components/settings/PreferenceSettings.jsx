
import {
  Box,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const PreferenceSettings = ({ preferences, onChange }) => {
  const updatePreference = (key, value) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: "1px solid #E8E3DE",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
        <PaletteOutlinedIcon sx={{ color: "#A9744F", fontSize: 28 }} />
        <Box>
          <Typography fontWeight={700} color="#3F342C" fontSize={18}>
            Theme and preferences
          </Typography>
          <Typography variant="body2" color="#77716C">
            Customize your SyncSpace experience
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ py: 2, borderBottom: "1px solid #F0EBE7" }}>
        <Typography fontWeight={600} color="#3F342C">
          Appearance
        </Typography>
        <Typography variant="body2" color="#77716C" mb={1}>
          Choose your preferred appearance for this settings page.
        </Typography>

        <FormControl>
          <RadioGroup
            row
            value={preferences.theme}
            onChange={(event) =>
              updatePreference("theme", event.target.value)
            }
          >
            <FormControlLabel
              value="light"
              control={<Radio sx={{ color: "#A9744F", "&.Mui-checked": { color: "#A9744F" } }} />}
              label="Light"
            />
            <FormControlLabel
              value="dark"
              control={<Radio sx={{ color: "#A9744F", "&.Mui-checked": { color: "#A9744F" } }} />}
              label="Dark"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center" mt={3} mb={1}>
        <NotificationsNoneOutlinedIcon sx={{ color: "#A9744F", fontSize: 27 }} />
        <Box>
          <Typography fontWeight={600} color="#3F342C">
            Notifications
          </Typography>
          <Typography variant="body2" color="#77716C">
            Choose which notification preferences to keep enabled.
          </Typography>
        </Box>
      </Stack>

      {[
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
      ].map((item) => (
        <Box
          key={item.key}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1.5,
            borderBottom: "1px solid #F0EBE7",
          }}
        >
          <Box>
            <Typography fontWeight={600} color="#3F342C">
              {item.title}
            </Typography>
            <Typography variant="body2" color="#77716C">
              {item.description}
            </Typography>
          </Box>

          <Switch
            checked={Boolean(preferences[item.key])}
            onChange={(event) =>
              updatePreference(item.key, event.target.checked)
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#A9744F" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#A9744F",
              },
            }}
          />
        </Box>
      ))}

      <Typography variant="caption" color="#77716C" display="block" mt={2}>
        Preferences are saved in this browser. Notification switches store
        your choices; they do not send or suppress actual notifications unless
        notification delivery is connected to the backend.
      </Typography>
    </Paper>
  );
};

export default PreferenceSettings;