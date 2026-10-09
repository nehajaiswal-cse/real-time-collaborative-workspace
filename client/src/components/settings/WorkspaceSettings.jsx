
// import {
//   Alert,
//   Box,
//   CircularProgress,
//   MenuItem,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

// const WorkspaceSettings = ({
//   workspaces,
//   workspaceId,
//   onWorkspaceChange,
//   loading,
//   error,
// }) => {
//   const workspace =
//     workspaces.find((item) => item._id === workspaceId) || null;

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
//       <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
//         <BusinessOutlinedIcon sx={{ color: "#A9744F", fontSize: 28 }} />
//         <Box>
//           <Typography fontWeight={700} color="#3F342C" fontSize={18}>
//             Workspace settings
//           </Typography>
//           <Typography variant="body2" color="#77716C">
//             View your available workspaces
//           </Typography>
//         </Box>
//       </Stack>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//           <CircularProgress sx={{ color: "#A9744F" }} />
//         </Box>
//       ) : workspaces.length === 0 ? (
//         <Alert severity="info">
//           No workspaces were returned by the backend for your account.
//         </Alert>
//       ) : (
//         <>
//           <TextField
//             select
//             fullWidth
//             label="Select workspace"
//             size="small"
//             value={workspaceId}
//             onChange={(event) => onWorkspaceChange(event.target.value)}
//             sx={{ mb: 3 }}
//           >
//             {workspaces.map((item) => (
//               <MenuItem key={item._id} value={item._id}>
//                 {item.name}
//               </MenuItem>
//             ))}
//           </TextField>

//           {workspace && (
//             <Box
//               sx={{
//                 p: 2,
//                 border: "1px solid #E8E3DE",
//                 borderRadius: 2,
//                 bgcolor: "#FFFCFA",
//               }}
//             >
//               <Typography variant="caption" color="#77716C">
//                 WORKSPACE NAME
//               </Typography>
//               <Typography fontWeight={700} color="#3F342C" mb={2}>
//                 {workspace.name || "Unnamed workspace"}
//               </Typography>

//               <Typography variant="caption" color="#77716C">
//                 DESCRIPTION
//               </Typography>
//               <Typography color="#3F342C" mb={2}>
//                 {workspace.description || "No description provided."}
//               </Typography>

//               <Typography variant="caption" color="#77716C">
//                 WORKSPACE ID
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ color: "#3F342C", overflowWrap: "anywhere" }}
//               >
//                 {workspace._id}
//               </Typography>
//             </Box>
//           )}

//           <Alert severity="info" sx={{ mt: 2.5 }}>
//             Workspace details are read-only. Updating a workspace requires a
//             backend update endpoint, which is not present in the current
//             backend routes.
//           </Alert>
//         </>
//       )}
//     </Paper>
//   );
// };

// export default WorkspaceSettings;

import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

import SettingsCard from "./SettingsCard.jsx";

// Small label + value pair used inside the details panel.
const DetailRow = ({ label, children, bold = false }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        mb: 0.5,
        color: "#77716C",
        letterSpacing: "0.06em",
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant={bold ? "body1" : "body2"}
      sx={{
        color: "#3F342C",
        fontWeight: bold ? 700 : 400,
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const WorkspaceSettings = ({
  workspaces = [],
  workspaceId,
  onWorkspaceChange,
  loading,
  error,
}) => {
  const workspace =
    workspaces.find((item) => item._id === workspaceId) || null;

  return (
    <SettingsCard
      icon={BusinessOutlinedIcon}
      title="Workspace settings"
      subtitle="View your available workspaces"
    >
      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : workspaces.length === 0 ? (
        <Alert severity="info">
          No workspaces were returned by the backend for your account.
        </Alert>
      ) : (
        <>
          <TextField
            select
            fullWidth
            size="small"
            label="Select workspace"
            value={workspaceId}
            onChange={(event) => onWorkspaceChange?.(event.target.value)}
          >
            {workspaces.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          {workspace && (
            <Stack
              spacing={2.5}
              sx={{
                p: 2.5,
                border: "1px solid #E8E3DE",
                borderRadius: 2,
                bgcolor: "#FFFCFA",
              }}
            >
              <DetailRow label="WORKSPACE NAME" bold>
                {workspace.name || "Unnamed workspace"}
              </DetailRow>

              <DetailRow label="DESCRIPTION">
                {workspace.description || "No description provided."}
              </DetailRow>

              <DetailRow label="WORKSPACE ID">{workspace._id}</DetailRow>
            </Stack>
          )}

          <Alert severity="info" sx={{ alignItems: "center" }}>
            Workspace details are read-only. Updating a workspace requires a
            backend update endpoint, which is not present in the current
            backend routes.
          </Alert>
        </>
      )}
    </SettingsCard>
  );
};

export default WorkspaceSettings;