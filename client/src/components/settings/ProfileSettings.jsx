
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileSettings = ({ user, loading, error }) => {
  const name = user?.name || "";
  const email = user?.email || "";
  const avatar = user?.avatar || "";

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
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <PersonIcon sx={{ color: "#A9744F", fontSize: 28 }} />

        <Box>
          <Typography fontWeight={700} color="#3F342C" fontSize={18}>
            Profile settings
          </Typography>
          <Typography variant="body2" color="#77716C">
            Your account information
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={3}
          >
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 68,
                height: 68,
                bgcolor: "#A9744F",
                fontSize: 25,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box>
              <Typography fontWeight={700} color="#3F342C">
                {name || "Name not available"}
              </Typography>
              <Typography variant="body2" color="#77716C">
                {email || "Email not available"}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Full name"
              value={name}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Email address"
              value={email}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Stack>

          <Alert severity="info" sx={{ mt: 2.5 }}>
            Profile information is loaded from your account. Editing and saving
            profile details requires a profile-update API, which is not present
            in the current backend.
          </Alert>
        </>
      )}
    </Paper>
  );
};

export default ProfileSettings;