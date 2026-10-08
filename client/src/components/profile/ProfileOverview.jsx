import {
  Avatar,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const ProfileOverview = ({ user }) => {
  const name = user?.name || "User";
  const email = user?.email || "Email not available";
  const avatar = user?.avatar || "";

  const initial = name
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        boxSizing: "border-box",

        p: {
          xs: 2.5,
          sm: 3,
          md: 4,
        },

        border: "1px solid #E8E3DE",
        borderRadius: "14px",

        bgcolor: "#FFFFFF",

        boxShadow:
          "0 2px 8px rgba(63, 52, 44, 0.06)",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        justifyContent="space-between"
        spacing={3}
      >
        <Stack
          direction="row"
          spacing={2.5}
          alignItems="center"
        >
          <Avatar
            src={avatar || undefined}
            sx={{
              width: {
                xs: 76,
                sm: 88,
              },

              height: {
                xs: 76,
                sm: 88,
              },

              bgcolor: "#A9744F",
              color: "#FFFFFF",

              fontSize: {
                xs: 28,
                sm: 32,
              },

              fontWeight: 600,
            }}
          >
            {initial || "U"}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 24,
                },

                fontWeight: 700,

                color: "#3F342C",
              }}
            >
              {name}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#77716C",
                fontSize: 14,
              }}
            >
              {email}
            </Typography>

            <Chip
              icon={
                <PersonOutlineOutlinedIcon
                  sx={{ fontSize: 16 }}
                />
              }
              label="Account"
              size="small"
              sx={{
                mt: 1.5,

                bgcolor: "#F4EAE2",
                color: "#8F5F3D",

                fontSize: 12,

                "& .MuiChip-icon": {
                  color: "#A9744F",
                },
              }}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            px: 2,
            py: 1.5,

            borderRadius: "10px",

            bgcolor: "#FFFCFA",

            border: "1px solid #E8E3DE",

            minWidth: {
              sm: 150,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "#77716C",
              mb: 0.5,
            }}
          >
            PROFILE STATUS
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#3F342C",
            }}
          >
            Active
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ProfileOverview;