import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AccountInformation = ({ user }) => {
  const hasToken = Boolean(
    localStorage.getItem("token")
  );

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        boxSizing: "border-box",

        p: {
          xs: 2.5,
          sm: 3,
        },

        border: "1px solid #E8E3DE",
        borderRadius: "14px",

        bgcolor: "#FFFFFF",

        boxShadow:
          "0 2px 8px rgba(63, 52, 44, 0.06)",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,

            borderRadius: "10px",

            bgcolor: "#F4EAE2",
            color: "#A9744F",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldOutlinedIcon />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#3F342C",
              fontSize: 17,
            }}
          >
            Account information
          </Typography>

          <Typography
            sx={{
              color: "#77716C",
              fontSize: 12,
              mt: 0.25,
            }}
          >
            Your account and authentication status
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2}>
        <Box
          sx={{
            p: 2,

            border: "1px solid #E8E3DE",
            borderRadius: "10px",

            bgcolor: "#FFFCFA",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3F342C",
                }}
              >
                Account status
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#77716C",
                  mt: 0.5,
                }}
              >
                Your SyncSpace account
              </Typography>
            </Box>

            <Chip
              icon={
                <CheckCircleOutlineOutlinedIcon />
              }
              label="Active"
              size="small"
              sx={{
                color: "#6B7A55",
                bgcolor: "#EEF4E8",

                "& .MuiChip-icon": {
                  color: "#6B7A55",
                },
              }}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 2,

            border: "1px solid #E8E3DE",
            borderRadius: "10px",

            bgcolor: "#FFFCFA",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <LockOutlinedIcon
              sx={{
                color: "#A9744F",
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3F342C",
                }}
              >
                Authentication
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#77716C",
                  mt: 0.5,
                }}
              >
                {hasToken
                  ? "You are currently authenticated."
                  : "No authentication token was found."}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {user?._id && (
          <Box
            sx={{
              p: 2,

              border: "1px solid #E8E3DE",
              borderRadius: "10px",

              bgcolor: "#FFFCFA",
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                color: "#77716C",
                mb: 0.5,
              }}
            >
              USER ID
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#3F342C",
                overflowWrap: "anywhere",
              }}
            >
              {user._id}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default AccountInformation;