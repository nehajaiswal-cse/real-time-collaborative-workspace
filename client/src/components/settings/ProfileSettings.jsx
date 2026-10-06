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
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const ProfileSettings = ({ user, loading, error }) => {
  const name = user?.name || "";
  const email = user?.email || "";
  const avatar = user?.avatar || "";
  const role = user?.role || "";

  const formattedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "";

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
        <PersonOutlineOutlinedIcon
          sx={{ color: "#A9744F", fontSize: 27 }}
        />

        <Box>
          <Typography
            fontWeight={700}
            color="#3F342C"
            fontSize={18}
          >
            Profile
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : (
        <>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#FFFCFA",
            }}
          >
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#A9744F",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={700}
                color="#3F342C"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name || "User"}
              </Typography>

              <Typography
                variant="body2"
                color="#77716C"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
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
        </>
      )}
    </Paper>
  );
};

export default ProfileSettings;