import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const SecuritySettings = () => {
  const hasToken = Boolean(localStorage.getItem("token"));

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
        <ShieldOutlinedIcon
          sx={{ color: "#A9744F", fontSize: 27 }}
        />

        <Box>
          <Typography
            fontWeight={700}
            color="#3F342C"
            fontSize={18}
          >
            Security
          </Typography>

          <Typography variant="body2" color="#77716C">
            Manage your account security
          </Typography>
        </Box>
      </Stack>

      {/* Active session */}
      <Box
        sx={{
          p: 2,
          border: "1px solid #E8E3DE",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
          bgcolor: "#FFFCFA",
        }}
      >
        <VerifiedUserOutlinedIcon
          sx={{
            color: hasToken ? "#4E8B57" : "#A9744F",
            fontSize: 29,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: hasToken ? "#4E8B57" : "#A9744F",
              }}
            />

            <Typography
              fontWeight={600}
              color="#3F342C"
            >
              {hasToken
                ? "Active session"
                : "Session unavailable"}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="#77716C"
            sx={{ mt: 0.4 }}
          >
            {hasToken
              ? "Your account is securely signed in."
              : "Please sign in to access your account."}
          </Typography>
        </Box>
      </Box>

      {/* Password */}
      <Box
        sx={{
          p: 2,
          border: "1px solid #E8E3DE",
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          mb={1}
        >
          <LockOutlinedIcon sx={{ color: "#A9744F" }} />

          <Typography fontWeight={600} color="#3F342C">
            Password
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          color="#77716C"
          mb={2}
        >
          Password management is currently unavailable.
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
    </Paper>
  );
};

export default SecuritySettings;