import { Box, Container, Typography } from "@mui/material";
import SectionHeading from "./SectionHeading";
import { BRAND, STEPS } from "./homeContent";

const HowItWorksSection = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 10 },
        scrollMarginTop: "68px",
        backgroundColor: BRAND.surface,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="Up and running in three steps"
          subtitle="No complex setup. Create an account and start collaborating right away."
        />

        <Box
          component="ol"
          sx={{
            m: 0,
            p: 0,
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {STEPS.map((step, index) => (
            <Box component="li" key={step.title} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mx: "auto",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                }}
              >
                {index + 1}
              </Box>

              <Typography
                component="h3"
                sx={{ fontWeight: 700, fontSize: 18, color: BRAND.textDark }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  mx: "auto",
                  maxWidth: 300,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: BRAND.textMuted,
                }}
              >
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
