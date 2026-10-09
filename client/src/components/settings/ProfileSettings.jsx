// import {
//   Alert,
//   Avatar,
//   Box,
//   CircularProgress,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import PersonIcon from "@mui/icons-material/Person";

// const ProfileSettings = ({
//   user,
//   loading,
//   error,
// }) => {
//   const name = user?.name || "";
//   const email = user?.email || "";
//   const avatar = user?.avatar || "";

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
//         mb={3}
//       >
//         <PersonIcon
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
//             Profile settings
//           </Typography>

//           <Typography
//             variant="body2"
//             color="#77716C"
//           >
//             Your account information
//           </Typography>
//         </Box>
//       </Stack>

//       {/* ERROR */}
//       {error && (
//         <Alert
//           severity="error"
//           sx={{ mb: 2 }}
//         >
//           {error}
//         </Alert>
//       )}

//       {/* CONTENT */}
//       {loading ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             py: 4,
//           }}
//         >
//           <CircularProgress
//             sx={{
//               color: "#A9744F",
//             }}
//           />
//         </Box>
//       ) : (
//         <>
//           {/* USER */}
//           <Stack
//             direction={{
//               xs: "column",
//               sm: "row",
//             }}
//             alignItems={{
//               xs: "flex-start",
//               sm: "center",
//             }}
//             spacing={2}
//             mb={3}
//           >
//             <Avatar
//               src={avatar || undefined}
//               sx={{
//                 width: 68,
//                 height: 68,
//                 bgcolor: "#A9744F",
//                 fontSize: 25,
//               }}
//             >
//               {name
//                 ? name.charAt(0).toUpperCase()
//                 : "U"}
//             </Avatar>

//             <Box>
//               <Typography
//                 fontWeight={700}
//                 color="#3F342C"
//               >
//                 {name || "Name not available"}
//               </Typography>

//               <Typography
//                 variant="body2"
//                 color="#77716C"
//               >
//                 {email || "Email not available"}
//               </Typography>
//             </Box>
//           </Stack>

//           {/* FIELDS */}
//           <Stack spacing={2}>
//             <TextField
//               label="Full name"
//               value={name}
//               fullWidth
//               size="small"
//               slotProps={{
//                 input: {
//                   readOnly: true,
//                 },
//               }}
//             />

//             <TextField
//               label="Email address"
//               value={email}
//               fullWidth
//               size="small"
//               slotProps={{
//                 input: {
//                   readOnly: true,
//                 },
//               }}
//             />
//           </Stack>

//           {/* INFO */}
//           <Alert
//             severity="info"
//             sx={{
//               mt: 2.5,
//             }}
//           >
//             Profile information is loaded from your
//             account. Editing and saving profile details
//             requires a profile-update API, which is not
//             present in the current backend.
//           </Alert>
//         </>
//       )}
//     </Paper>
//   );
// };

// export default ProfileSettings;


import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Person from "@mui/icons-material/Person";

import SettingsCard from "./SettingsCard.jsx";

const ProfileSettings = ({ user, loading, error }) => {
  const name = user?.name || "";
  const email = user?.email || "";
  const avatar = user?.avatar || "";

  return (
    <SettingsCard
      icon={Person}
      title="Profile settings"
      subtitle="Your account information"
    >
      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : (
        <>
          {/* USER SUMMARY */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2.5}
          >
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                bgcolor: "#A9744F",
                fontSize: 24,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontWeight: 700, color: "#3F342C", lineHeight: 1.4 }}
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
            </Box>
          </Stack>

          {/* FORM FIELDS */}
          <Stack spacing={2.5}>
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

          {/* INFORMATION */}
          <Alert severity="info" sx={{ alignItems: "center" }}>
            Profile information is loaded from your account. Editing and
            saving profile details requires a profile-update API, which is
            not present in the current backend.
          </Alert>
        </>
      )}
    </SettingsCard>
  );
};

export default ProfileSettings;