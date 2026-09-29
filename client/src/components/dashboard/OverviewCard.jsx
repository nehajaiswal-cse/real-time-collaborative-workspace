import { Box, Typography } from "@mui/material";

const OverviewCard = ({ title, value, icon }) => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #E8E3DE",
        borderRadius: 3.5,
        p: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(63, 52, 44, 0.04)",
      }}
    >
      {/* Content */}
      <Box>
        <Typography
          sx={{
            fontSize: 14,
            color: "#77716C",
            mb: 0.75,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: "#3F342C",
          }}
        >
          {value}
        </Typography>
      </Box>

      {/* Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          bgcolor: "#F4ECE6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#A9744F",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

export default OverviewCard;