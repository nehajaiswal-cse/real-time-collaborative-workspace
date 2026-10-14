import { useState } from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { BRAND, ROUTES } from "./homeContent";

// Reads the same "token" key that Login.jsx saves and ProtectedRoute.jsx checks.
const hasToken = () => Boolean(localStorage.getItem("token"));

const primarySx = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 2,
  px: { xs: 2, sm: 3 },
  whiteSpace: "nowrap",
  background: `linear-gradient(135deg, ${BRAND.primaryDarker}, ${BRAND.primaryDark})`,
  boxShadow: "none",
  "&:hover": {
    background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primaryDarker})`,
    boxShadow: "none",
  },
};

const outlineSx = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 2,
  px: { xs: 2, sm: 3 },
  whiteSpace: "nowrap",
  color: BRAND.textDark,
  borderColor: BRAND.textDark,
  "&:hover": {
    borderColor: BRAND.primaryDark,
    backgroundColor: BRAND.primaryDark,
  },
};

/**
 * Renders Sign in and Register, or a single Dashboard button when a session exists.
 * size: MUI Button size ("medium" | "large")
 */
const AuthButtons = ({ size = "medium", fullWidth = false }) => {
  // Lazy state initializer: runs once, avoids reading localStorage on every render.
  const [isLoggedIn] = useState(hasToken);

  if (isLoggedIn) {
    return (
      <Button
        component={Link}
        to={ROUTES.dashboard}
        variant="contained"
        size={size}
        fullWidth={fullWidth}
        sx={primarySx}
      >
        Go to Dashboard
      </Button>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        width: fullWidth ? "100%" : "auto",
        flexDirection: { xs: fullWidth ? "column" : "row", sm: "row" },
      }}
    >
      <Button
        component={Link}
        to={ROUTES.login}
        variant="outlined"
        size={size}
        fullWidth={fullWidth}
        sx={outlineSx}
      >
        Sign in
      </Button>

      <Button
        component={Link}
        to={ROUTES.register}
        variant="contained"
        size={size}
        fullWidth={fullWidth}
        sx={primarySx}
      >
        Register
      </Button>
    </Box>
  );
};

export default AuthButtons;
