
import {
  Alert,
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
        mb: 3,
        border: "1px solid #E8E3DE",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <ShieldOutlinedIcon sx={{ color: "#A9744F", fontSize: 28 }} />
        <Box>
          <Typography fontWeight={700} color="#3F342C" fontSize={18}>
            Security settings
          </Typography>
          <Typography variant="body2" color="#77716C">
            Account access and password security
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          p: 2,
          border: "1px solid #E8E3DE",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <VerifiedUserOutlinedIcon sx={{ color: "#A9744F", fontSize: 30 }} />

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600} color="#3F342C">
            Authentication status
          </Typography>
          <Typography variant="body2" color="#77716C">
            {hasToken
              ? "An authentication token is stored in this browser."
              : "No authentication token was found. Please log in."}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          border: "1px solid #E8E3DE",
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <LockOutlinedIcon sx={{ color: "#A9744F" }} />
          <Typography fontWeight={600} color="#3F342C">
            Change password
          </Typography>
        </Stack>

        <Typography variant="body2" color="#77716C" mb={2}>
          Password changes are not yet connected to the backend.
        </Typography>

        <Button
          variant="outlined"
          disabled
          sx={{
            textTransform: "none",
            borderColor: "#E8E3DE",
            color: "#77716C",
          }}
        >
          Change password
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 2.5 }}>
        Missing API: the current backend does not expose a password-change
        endpoint. Your backend team will need to implement one before this
        action can be enabled.
      </Alert>
    </Paper>
  );
};

export default SecuritySettings;