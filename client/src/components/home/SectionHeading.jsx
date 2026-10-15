import { Box, Typography } from "@mui/material";
import { BRAND } from "./homeContent";

// Reusable heading block so every section has the same typography and spacing.
const SectionHeading = ({ title, subtitle }) => (
  <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 6 }}>
    <Typography
      component="h2"
      sx={{
        fontFamily: BRAND.headingFont,
        fontWeight: 700,
        fontSize: { xs: 28, md: 34 },
        color: BRAND.textDark,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography sx={{ mt: 1.5, color: BRAND.textMuted, lineHeight: 1.7 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeading;
