import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import {
  PersonOutlined as ProfileIcon,
  SecurityOutlined as SecurityIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  PaletteOutlined as DisplayIcon,
  CloudUploadOutlined as UploadIcon,
  SaveOutlined as SaveIcon,
  LockOutlined as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircleOutlined as CheckIcon,
} from "@mui/icons-material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // User Profile State
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Senior Full-Stack Developer",
    bio: "Passionate about building real-time collaborative web applications.",
    timezone: "UTC+05:30 (India Standard Time)",
    language: "en",
  });

  // Password / Security State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    boardActivity: true,
    mentions: true,
    desktopAlerts: false,
  });

  // Display & Workspace Preferences
  const [preferences, setPreferences] = useState({
    theme: "light",
    compactView: false,
    autoSave: true,
  });

  // Notification Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePreferenceToggle = (field) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSnackbar({
      open: true,
      message: "Profile settings saved successfully!",
      severity: "success",
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword) {
      setSnackbar({
        open: true,
        message: "Please enter your current and new password.",
        severity: "error",
      });
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match!",
        severity: "error",
      });
      return;
    }
    setSnackbar({
      open: true,
      message: "Password updated successfully!",
      severity: "success",
    });
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: security.twoFactorEnabled,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar onMenuClick={handleMenuClick} />

      {/* Fixed Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          boxSizing: "border-box",
          mt: "72px",
          ml: sidebarOpen ? "256px" : "72px",
          height: "calc(100vh - 72px)",
          overflowY: "auto",
          minWidth: 0,
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Page Title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#3F342C",
              mb: 0.5,
            }}
          >
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Manage your personal profile, security options, and workspace preferences.
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
            border: "1px solid #EFE9E4",
            mb: 3,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                minHeight: 52,
                color: "#786C62",
                "&.Mui-selected": {
                  color: "#A9744F",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#A9744F",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab icon={<ProfileIcon fontSize="small" />} iconPosition="start" label="Profile" />
            <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Security & Password" />
            <Tab icon={<NotificationsIcon fontSize="small" />} iconPosition="start" label="Notifications" />
            <Tab icon={<DisplayIcon fontSize="small" />} iconPosition="start" label="Preferences" />
          </Tabs>
        </Paper>

        {/* TAB 0: PROFILE SETTINGS */}
        {activeTab === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #EFE9E4",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 3 }}>
              Personal Information
            </Typography>

            <Box component="form" onSubmit={handleSaveProfile}>
              {/* Avatar Upload Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 4,
                  pb: 3,
                  borderBottom: "1px solid #F7F2EE",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#A9744F",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(169, 116, 79, 0.25)",
                  }}
                >
                  {profile.name ? profile.name.charAt(0) : "A"}
                </Avatar>

                <Box>
                  <Box sx={{ display: "flex", gap: 1.5, mb: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<UploadIcon />}
                      sx={{
                        borderColor: "#EFE9E4",
                        color: "#3F342C",
                        textTransform: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        "&:hover": { borderColor: "#A9744F", backgroundColor: "rgba(169, 116, 79, 0.06)" },
                      }}
                    >
                      Change Photo
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                      onClick={() =>
                        setSnackbar({
                          open: true,
                          message: "Avatar reset to default.",
                          severity: "info",
                        })
                      }
                    >
                      Remove
                    </Button>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#786C62' }}>
                    Recommended format: JPG or PNG (Max 2MB)
                  </Typography>
                </Box>
              </Box>

              {/* Form Input Fields */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Role / Job Title
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Language
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="language"
                      value={profile.language}
                      onChange={handleProfileChange}
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#A9744F",
                        },
                      }}
                    >
                      <MenuItem value="en">English (US)</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Bio
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell your team a little about yourself..."
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #A9744F, #8B5E3C)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      px: 3,
                      py: 1,
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(169, 116, 79, 0.25)",
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #966541, #7A5133)",
                        boxShadow: "0 6px 16px rgba(169, 116, 79, 0.35)",
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        {/* TAB 1: SECURITY & PASSWORD */}
        {activeTab === 1 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #EFE9E4",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 3 }}>
              Change Password
            </Typography>

            <Box component="form" onSubmit={handleUpdatePassword}>
              <Grid container spacing={3} maxWidth="md">
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Current Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={handleSecurityChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          size="small"
                        >
                          {showCurrentPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    New Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={security.newPassword}
                    onChange={handleSecurityChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          size="small"
                        >
                          {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                    Confirm New Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="confirmPassword"
                    type="password"
                    value={security.confirmPassword}
                    onChange={handleSecurityChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<LockIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #A9744F, #8B5E3C)",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      px: 3,
                      py: 1,
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(169, 116, 79, 0.25)",
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #966541, #7A5133)",
                        boxShadow: "0 6px 16px rgba(169, 116, 79, 0.35)",
                      },
                    }}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4, borderColor: "#EFE9E4" }} />

            {/* Two Factor Authentication */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 1 }}>
              Two-Factor Authentication (2FA)
            </Typography>
            <Typography variant="body2" sx={{ color: "#786C62", mb: 2 }}>
              Add an extra layer of security to your account using an authenticator app.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={security.twoFactorEnabled}
                  onChange={() =>
                    setSecurity((prev) => ({
                      ...prev,
                      twoFactorEnabled: !prev.twoFactorEnabled,
                    }))
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#A9744F",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#A9744F",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                  {security.twoFactorEnabled ? "2FA is Enabled" : "2FA is Disabled"}
                </Typography>
              }
            />
          </Paper>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {activeTab === 2 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 1 }}>
              Notification Preferences
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              Control when and how you receive updates from your team.
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailUpdates}
                      onChange={() => handleNotificationToggle("emailUpdates")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#A9744F" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#A9744F" },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3F342C" }}>
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#786C62" }}>
                        Receive weekly digest and project status emails.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.boardActivity}
                      onChange={() => handleNotificationToggle("boardActivity")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#A9744F" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#A9744F" },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3F342C" }}>
                        Board Activity Alerts
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#786C62" }}>
                        Get notified when a team member modifies or comments on your board.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.mentions}
                      onChange={() => handleNotificationToggle("mentions")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#A9744F" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#A9744F" },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3F342C" }}>
                        @Mentions & Direct Messages
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#786C62" }}>
                        Instant alerts when someone tags you in a card or comment.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* TAB 3: DISPLAY & WORKSPACE PREFERENCES */}
        {activeTab === 3 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #EFE9E4",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 3 }}>
              Workspace Preferences
            </Typography>

            <Grid container spacing={3} maxWidth="md">
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#3F342C", mb: 0.75 }}>
                  Theme Appearance
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={preferences.theme}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#A9744F",
                      },
                    }}
                  >
                    <MenuItem value="light">Light Mode (Default)</MenuItem>
                    <MenuItem value="dark">Dark Mode</MenuItem>
                    <MenuItem value="system">System Synchronized</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoSave}
                      onChange={() => handlePreferenceToggle("autoSave")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#A9744F" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#A9744F" },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#3F342C" }}>
                        Real-time Auto-Save
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#786C62" }}>
                        Automatically save board and canvas changes as you type.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Snackbar Alert Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
