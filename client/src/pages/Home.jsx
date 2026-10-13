import { Box, GlobalStyles } from "@mui/material";
import {
  HomeNavbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CallToAction,
  HomeFooter,
} from "../components/home";

// Page component: only composes sections. No business logic lives here.
const Home = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Smooth scrolling for the #features and #how-it-works anchor links */}
      <GlobalStyles styles={{ html: { scrollBehavior: "smooth" } }} />

      <HomeNavbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CallToAction />
      </Box>

      <HomeFooter />
    </Box>
  );
};

export default Home;
