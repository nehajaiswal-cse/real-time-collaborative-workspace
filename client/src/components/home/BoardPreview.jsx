import { Avatar, AvatarGroup, Box, Paper, Typography } from "@mui/material";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import { BRAND, PREVIEW_COLUMNS, PREVIEW_MEMBERS } from "./homeContent";

// Purely presentational mock of a Kanban board. It is decorative, so it is
// hidden from screen readers with aria-hidden to avoid confusing assistive tech.
const BoardPreview = () => {
  return (
    <Paper
      aria-hidden="true"
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: 4,
        border: `1px solid ${BRAND.border}`,
        boxShadow: "0 20px 50px rgba(169,116,79,0.18)",
        backgroundColor: "#fff",
      }}
    >
      {/* Board header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, color: BRAND.textDark }}>
            Product Launch
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FiberManualRecord sx={{ fontSize: 10, color: "#22c55e" }} />
            <Typography sx={{ fontSize: 12, color: BRAND.textMuted }}>
              4 members online
            </Typography>
          </Box>
        </Box>

        <AvatarGroup
          max={4}
          sx={{
            "& .MuiAvatar-root": {
              width: 28,
              height: 28,
              fontSize: 12,
              bgcolor: BRAND.primary,
              borderColor: "#fff",
            },
          }}
        >
          {PREVIEW_MEMBERS.map((initial) => (
            <Avatar key={initial}>{initial}</Avatar>
          ))}
        </AvatarGroup>
      </Box>

      {/* Columns use CSS Grid: 3 equal tracks on tablet and up, 1 track on mobile */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 1.5,
        }}
      >
        {PREVIEW_COLUMNS.map((column) => (
          <Box
            key={column.title}
            sx={{ backgroundColor: BRAND.tint, borderRadius: 3, p: 1.25 }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: BRAND.primaryDark,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                mb: 1,
              }}
            >
              {column.title} ({column.cards.length})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {column.cards.map((card) => (
                <Box
                  key={card.text}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    p: 1.25,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: BRAND.textDark }}>
                    {card.text}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.75,
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: BRAND.primary,
                      backgroundColor: BRAND.tint,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                    }}
                  >
                    {card.tag}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default BoardPreview;
