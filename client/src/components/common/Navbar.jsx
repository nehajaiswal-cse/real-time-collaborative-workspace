import * as React from "react";

import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
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
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
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

  [theme.breakpoints.up("sm")]: {
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

// Profile icon on top, the logged-in user's name (and email) underneath
const ProfileSummary = ({ name, email }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      px: 2,
      py: 1,
    }}
  >
    <AccountCircle sx={{ fontSize: 48, color: PRIMARY_COLOR }} />
    <Typography
      variant="subtitle2"
      fontWeight={700}
      noWrap
      sx={{ maxWidth: 200 }}
    >
      {name}
    </Typography>
    {email && (
      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{ maxWidth: 200 }}
      >
        {email}
      </Typography>
    )}
  </Box>
);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState(null);
  // Used to open the notification list from the mobile menu
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Re-read whenever a menu opens so the name is always the current user
  const user = getStoredUser();
  const userName = user?.name || "User";
  const userEmail = user?.email || "";

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

  const handleOpenNotifications = () => {
    // show the list under the same 3-dots button, then close the menu
    setNotificationAnchorEl(mobileMoreAnchorEl);
    setMobileMoreAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleMenuClose();
    navigate("/profile");
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
            <NotificationBell
              externalAnchorEl={notificationAnchorEl}
              onExternalClose={() => setNotificationAnchorEl(null)}
              onUnreadChange={setUnreadCount}
            />
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
            <Badge
              color="error"
              variant="dot"
              invisible={unreadCount === 0}
            >
              <MoreIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Large screens: account menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        id="primary-search-account-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
      >
        <ProfileSummary name={userName} email={userEmail} />
        <Divider />
        <MenuItem onClick={handleGoToProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
      </Menu>

      {/* Mobile: messages, notifications, profile */}
      <Menu
        anchorEl={mobileMoreAnchorEl}
        open={isMobileMenuOpen}
        onClose={handleMenuClose}
        id="primary-search-account-menu-mobile"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText>Messages</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleOpenNotifications}>
          <ListItemIcon>
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <NotificationsNoneIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
        </MenuItem>

        <Divider />

        {/* Profile icon with the logged-in user below it */}
        <MenuItem onClick={handleGoToProfile}>
          <ProfileSummary name={userName} email={userEmail} />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;

