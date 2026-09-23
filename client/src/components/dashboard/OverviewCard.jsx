import { Box, Typography } from "@mui/material";

const OverviewCard = ({ title, value, icon }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8E3DE",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(63, 52, 44, 0.04)",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#77716C",
            marginBottom: "6px",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#3F342C",
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          backgroundColor: "#F4ECE6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#A9744F",
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

export default OverviewCard;