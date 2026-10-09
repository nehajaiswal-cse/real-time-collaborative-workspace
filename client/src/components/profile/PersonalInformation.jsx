import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const PersonalInformation = ({ user }) => {
  const name = user?.name || "";
  const email = user?.email || "";

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
          <PersonOutlineOutlinedIcon />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#3F342C",
              fontSize: 17,
            }}
          >
            Personal information
          </Typography>

          <Typography
            sx={{
              color: "#77716C",
              fontSize: 12,
              mt: 0.25,
            }}
          >
            Your basic account details
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2}>
        <TextField
          label="Full name"
          value={name}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <TextField
          label="Email address"
          value={email}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

export default PersonalInformation;