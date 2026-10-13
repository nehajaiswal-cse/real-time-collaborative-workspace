import * as React from "react";

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { alpha, styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationBell from "../notifications/NotificationBell";

const PRIMARY_COLOR = "#A9744F";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  backgroundColor: alpha("#ffffff", 0.15),

  "&:hover": {
    backgroundColor: alpha("#ffffff", 0.25),
  },

  marginLeft: theme.spacing(3),
  width: "100%",

  [theme.breakpoints.up("nsm")]: {
    width: "260px",
  },

  [theme.breakpoints.up("md")]: {
    width: "320px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff",

  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#ffffff",
    opacity: 0.8,
  },
}));

const Navbar = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: PRIMARY_COLOR,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: { xs: 1.5, sm: 3 },
        }}
      >
        {/* Menu Button */}
        <IconButton
          size="large"
          edge="start"
          aria-label="toggle sidebar"
          onClick={onMenuClick}
          sx={{
            mr: 1,
            color: "#ffffff",
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            display: { xs: "none", sm: "block" },
          }}
        >
          SyncSpace
        </Typography>

        {/* Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>

          <StyledInputBase
            placeholder="Search..."
            inputProps={{
              "aria-label": "search",
            }}
          />
        </Search>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Actions */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
          }}
        >
          {/* Messages */}
          <IconButton
            size="large"
            aria-label="show messages"
            sx={{ color: "#ffffff" }}
          >
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>

         {/* Notifications */}
          <Box sx={{ color: "#ffffff" }}>
            <NotificationBell />
          </Box>
          {/* Account */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#ffffff" }}
          >
            <AccountCircle />
          </IconButton>
        </Box>

        {/* Mobile Actions */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
          }}
        >
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls="primary-search-account-menu-mobile"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            sx={{ color: "#ffffff" }}
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
