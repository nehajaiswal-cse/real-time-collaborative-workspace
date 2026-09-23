import { Box, Typography } from "@mui/material";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";

const WelcomeHeader = ({ userName = "User" }) => {
  const currentHour = new Date().getHours();

  let greeting;
  let icon;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
    icon = (
      <WbSunnyOutlinedIcon
        sx={{
          color: "#A9744F",
          fontSize: 28,
        }}
      />
    );
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
    icon = (
      <WbSunnyOutlinedIcon
        sx={{
          color: "#A9744F",
          fontSize: 28,
        }}
      />
    );
  } else {
    greeting = currentHour >= 18 && currentHour < 22
      ? "Good evening"
      : "Good night";

    icon = (
      <NightsStayOutlinedIcon
        sx={{
          color: "#A9744F",
          fontSize: 28,
        }}
      />
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#3F342C",
            fontFamily: "Georgia, serif",
          }}
        >
          {greeting}, {userName}!
        </Typography>

        {icon}
      </Box>

      <Typography
        variant="body1"
        sx={{
          color: "#77716C",
          fontSize: "15px",
        }}
      >
        Here's what's happening in your workspace today.
      </Typography>
    </Box>
  );
};

export default WelcomeHeader;