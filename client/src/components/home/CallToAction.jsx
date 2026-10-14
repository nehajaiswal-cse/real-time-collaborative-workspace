import { Box, Container, Typography } from "@mui/material";
import AuthButtons from "./AuthButtons";
import { BRAND } from "./homeContent";

const CallToAction = () => {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#fff" }}>
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            px: { xs: 3, md: 8 },
            py: { xs: 5, md: 7 },
            borderRadius: 5,
            border: `1px solid ${BRAND.border}`,
            background: `linear-gradient(135deg, ${BRAND.surface} 0%, ${BRAND.tint} 100%)`,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: BRAND.headingFont,
              fontWeight: 700,
              fontSize: { xs: 26, md: 32 },
              color: BRAND.textDark,
            }}
          >
            Ready to work better together?
          </Typography>

          <Typography sx={{ mt: 1.5, mb: 4, color: BRAND.textMuted }}>
            Create your free account or sign in to open your workspace.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AuthButtons size="large" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToAction;
