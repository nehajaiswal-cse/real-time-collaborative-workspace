import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

const ProfileHeader = ({ onRefresh, loading }) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        justifyContent: "space-between",
        gap: 2,
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            flexShrink: 0,

            borderRadius: "12px",

            bgcolor: "#F4EAE2",
            color: "#A9744F",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonOutlineOutlinedIcon fontSize="large" />
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "#3F342C",
              fontSize: {
                xs: "25px",
                sm: "30px",
              },
            }}
          >
            Profile
          </Typography>

          <Typography
            sx={{
              color: "#77716C",
              mt: 0.5,
              fontSize: 14,
            }}
          >
            Manage your account information.
          </Typography>
        </Box>
      </Stack>

      <Button
        variant="outlined"
        size="small"
        startIcon={<RefreshOutlinedIcon />}
        onClick={onRefresh}
        disabled={loading}
        sx={{
          textTransform: "none",

          color: "#A9744F",
          borderColor: "#A9744F",

          borderRadius: "8px",

          "&:hover": {
            borderColor: "#8F5F3D",
            backgroundColor: "#F9F1EB",
          },
        }}
      >
        Refresh
      </Button>
    </Box>
  );
};

export default ProfileHeader;