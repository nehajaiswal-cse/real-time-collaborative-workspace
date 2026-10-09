import { Box, Paper, Stack, Typography } from "@mui/material";

// Single source of truth for card padding, header layout and the
// vertical rhythm between sections inside a card.
const SettingsCard = ({ icon: Icon, title, subtitle, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        p: { xs: 2.5, sm: 3, md: 4 },
        border: "1px solid #E8E3DE",
        borderRadius: "14px",
        bgcolor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(63, 52, 44, 0.06)",
      }}
    >
      {/* HEADER */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            bgcolor: "#F4EAE2",
            color: "#A9744F",
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1.3,
              color: "#3F342C",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "#77716C", lineHeight: 1.5 }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      {/* BODY: Stack gives a consistent 24px gap between every child */}
      <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Stack>
    </Paper>
  );
};

export default SettingsCard;