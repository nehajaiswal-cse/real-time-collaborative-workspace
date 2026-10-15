import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import { BRAND, NAV_LINKS } from "./homeContent";

const HomeNavbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        // backgroundColor: "rgba(255,255,255,0.85)",
        backgroundColor: BRAND.primary,
        // backdrop-filter blurs the content scrolling behind the bar (frosted glass effect)
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BRAND.border}`,
        color: BRAND.textDark,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 68, gap: { xs: 1, sm: 3 } }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: BRAND.headingFont,
              fontWeight: 700,
              fontSize: { xs: 20, sm: 24 },
              color: BRAND.surface,
              textDecoration: "none",
            }}
          >
            {BRAND.name}
          </Typography>

          {/* Anchor links hide on mobile to keep the bar uncluttered */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, ml: 2 }}>
            {NAV_LINKS.map((link) => (
              <Box
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  color: BRAND.surface,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": { color: BRAND.primary },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <AuthButtons />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HomeNavbar;
