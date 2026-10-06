// import {
//   Box,
//   FormControl,
//   FormControlLabel,
//   Paper,
//   Radio,
//   RadioGroup,
//   Stack,
//   Switch,
//   Typography,
// } from "@mui/material";

// import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

// const PreferenceSettings = ({
//   preferences,
//   onChange,
// }) => {
//   const updatePreference = (key, value) => {
//     onChange({
//       ...preferences,
//       [key]: value,
//     });
//   };

//   return (
//     <Paper
//       sx={{
//         height: "100%",
//         width: "100%",
//         boxSizing: "border-box",

//         p: { xs: 2, sm: 2.5 },

//         border: "1px solid #E8E3DE",
//         borderRadius: "12px",

//         bgcolor: "#FFFFFF",

//         boxShadow: "0 2px 8px rgba(63, 52, 44, 0.06)",

//         display: "flex",
//         flexDirection: "column",

//         overflow: "hidden",
//       }}
//     >
//       {/* HEADER */}
//       <Stack
//         direction="row"
//         spacing={1.5}
//         alignItems="center"
//         mb={2}
//       >
//         <PaletteOutlinedIcon
//           sx={{
//             color: "#A9744F",
//             fontSize: 28,
//           }}
//         />

//         <Box>
//           <Typography
//             fontWeight={700}
//             color="#3F342C"
//             fontSize={18}
//           >
//             Theme and preferences
//           </Typography>

//           <Typography
//             variant="body2"
//             color="#77716C"
//           >
//             Customize your SyncSpace experience
//           </Typography>
//         </Box>
//       </Stack>

//       {/* APPEARANCE */}
//       <Box
//         sx={{
//           py: 2,
//           borderBottom: "1px solid #F0EBE7",
//         }}
//       >
//         <Typography
//           fontWeight={600}
//           color="#3F342C"
//         >
//           Appearance
//         </Typography>

//         <Typography
//           variant="body2"
//           color="#77716C"
//           mb={1}
//         >
//           Choose your preferred appearance for this
//           settings page.
//         </Typography>

//         <FormControl>
//           <RadioGroup
//             row
//             value={preferences.theme || "light"}
//             onChange={(event) =>
//               updatePreference(
//                 "theme",
//                 event.target.value
//               )
//             }
//           >
//             <FormControlLabel
//               value="light"
//               control={
//                 <Radio
//                   sx={{
//                     color: "#A9744F",
//                     "&.Mui-checked": {
//                       color: "#A9744F",
//                     },
//                   }}
//                 />
//               }
//               label="Light"
//             />

//             <FormControlLabel
//               value="dark"
//               control={
//                 <Radio
//                   sx={{
//                     color: "#A9744F",
//                     "&.Mui-checked": {
//                       color: "#A9744F",
//                     },
//                   }}
//                 />
//               }
//               label="Dark"
//             />
//           </RadioGroup>
//         </FormControl>
//       </Box>

//       {/* NOTIFICATIONS */}
//       <Stack
//         direction="row"
//         spacing={1.5}
//         alignItems="center"
//         mt={3}
//         mb={1}
//       >
//         <NotificationsNoneOutlinedIcon
//           sx={{
//             color: "#A9744F",
//             fontSize: 27,
//           }}
//         />

//         <Box>
//           <Typography
//             fontWeight={600}
//             color="#3F342C"
//           >
//             Notifications
//           </Typography>

//           <Typography
//             variant="body2"
//             color="#77716C"
//           >
//             Choose which notification preferences to
//             keep enabled.
//           </Typography>
//         </Box>
//       </Stack>

//       {/* NOTIFICATION OPTIONS */}
//       {[
//         {
//           key: "emailNotifications",
//           title: "Email notifications",
//           description:
//             "Preference for receiving email updates.",
//         },
//         {
//           key: "workspaceNotifications",
//           title: "Workspace notifications",
//           description:
//             "Preference for workspace activity updates.",
//         },
//       ].map((item) => (
//         <Box
//           key={item.key}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 2,
//             py: 1.5,
//             borderBottom: "1px solid #F0EBE7",
//           }}
//         >
//           <Box>
//             <Typography
//               fontWeight={600}
//               color="#3F342C"
//             >
//               {item.title}
//             </Typography>

//             <Typography
//               variant="body2"
//               color="#77716C"
//             >
//               {item.description}
//             </Typography>
//           </Box>

//           <Switch
//             checked={Boolean(
//               preferences[item.key]
//             )}
//             onChange={(event) =>
//               updatePreference(
//                 item.key,
//                 event.target.checked
//               )
//             }
//             sx={{
//               "& .MuiSwitch-switchBase.Mui-checked": {
//                 color: "#A9744F",
//               },

//               "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
//               {
//                 backgroundColor: "#A9744F",
//               },
//             }}
//           />
//         </Box>
//       ))}

//       {/* FOOTNOTE */}
//       <Typography
//         variant="caption"
//         color="#77716C"
//         display="block"
//         mt={2}
//       >
//         Preferences are saved in this browser.
//         Notification switches store your choices; they
//         do not send or suppress actual notifications
//         unless notification delivery is connected to
//         the backend.
//       </Typography>
//     </Paper>
//   );
// };

// export default PreferenceSettings;


import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import SettingsCard from "./SettingsCard.jsx";

const ACCENT = "#A9744F";

const radioSx = {
  color: ACCENT,
  "&.Mui-checked": { color: ACCENT },
};

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
      title="Theme and preferences"
      subtitle="Customize your SyncSpace experience"
    >
      {/* APPEARANCE */}
      <Box>
        <Typography sx={{ fontWeight: 600, color: "#3F342C" }}>
          Appearance
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 0.5, mb: 1.5, color: "#77716C" }}
        >
          Choose your preferred appearance for this settings page.
        </Typography>

        <FormControl>
          <RadioGroup
            row
            value={preferences.theme || "light"}
            onChange={(event) => updatePreference("theme", event.target.value)}
            sx={{ columnGap: 3 }}
          >
            <FormControlLabel
              value="light"
              control={<Radio size="small" sx={radioSx} />}
              label="Light"
            />
            <FormControlLabel
              value="dark"
              control={<Radio size="small" sx={radioSx} />}
              label="Dark"
            />
          </RadioGroup>
        </FormControl>
      </Box>

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