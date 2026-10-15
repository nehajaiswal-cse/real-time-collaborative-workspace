import { Box, Container, Typography } from "@mui/material";
import { BRAND } from "./homeContent";

const HomeFooter = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 4, borderTop: `1px solid ${BRAND.border}`, backgroundColor: "#fff" }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{ fontFamily: BRAND.headingFont, fontWeight: 700, color: BRAND.primary }}
        >
          {BRAND.name}
        </Typography>

        <Typography sx={{ fontSize: 13, color: BRAND.textMuted }}>
          © {new Date().getFullYear()} {BRAND.name}. Built for real time teamwork.
        </Typography>
      </Container>
    </Box>
  );
};

export default HomeFooter;
