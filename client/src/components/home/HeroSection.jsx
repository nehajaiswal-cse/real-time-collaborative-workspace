import { Box, Container, Typography } from "@mui/material";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import AuthButtons from "./AuthButtons";
import BoardPreview from "./BoardPreview";
import { BRAND, HERO, HERO_POINTS } from "./homeContent";

const HeroSection = () => {
  return (
    <Box
      component="section"
      sx={{
        background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${BRAND.tint} 100%)`,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
          gap: { xs: 6, md: 8 },
          alignItems: "center",
        }}
      >
        {/* Left column: message and call to action (CTA) */}
        <Box>
          <Typography
            sx={{
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              mb: 2,
              fontSize: 13,
              fontWeight: 600,
              color: BRAND.primaryDark,
              backgroundColor: "#fff",
              border: `1px solid ${BRAND.border}`,
              borderRadius: 99,
            }}
          >
            {HERO.badge}
          </Typography>

          {/* component="h1" keeps one semantic h1 per page, which is good for SEO and accessibility */}
          <Typography
            component="h1"
            sx={{
              fontFamily: BRAND.headingFont,
              fontWeight: 700,
              lineHeight: 1.15,
              fontSize: { xs: 34, sm: 42, md: 48 },
              color: BRAND.textDark,
            }}
          >
            {HERO.title}
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 520,
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.7,
              color: BRAND.textMuted,
            }}
          >
            {HERO.subtitle}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <AuthButtons size="large" />
          </Box>

          <Box
            component="ul"
            sx={{
              mt: 4,
              p: 0,
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 1.5, sm: 3 },
            }}
          >
            {HERO_POINTS.map((point) => (
              <Box
                component="li"
                key={point}
                sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
              >
                <CheckCircleOutlined sx={{ fontSize: 18, color: BRAND.primary }} />
                <Typography sx={{ fontSize: 14, color: BRAND.textMuted }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right column: product preview */}
        <BoardPreview />
      </Container>
    </Box>
  );
};

export default HeroSection;
