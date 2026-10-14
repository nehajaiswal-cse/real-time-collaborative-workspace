import { Box, Container } from "@mui/material";
import FeatureCard from "./FeatureCard";
import SectionHeading from "./SectionHeading";
import { FEATURES } from "./homeContent";

const FeaturesSection = () => {
  return (
    <Box
      component="section"
      id="features"
      // scrollMarginTop offsets the sticky navbar so the heading is not hidden after an anchor jump
      sx={{ py: { xs: 8, md: 10 }, scrollMarginTop: "68px", backgroundColor: "#fff" }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="Everything your team needs"
          subtitle="Simple tools that work together, so you spend less time switching apps and more time shipping."
        />

        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
