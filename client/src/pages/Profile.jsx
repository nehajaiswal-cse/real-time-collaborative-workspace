import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  EmailOutlined as EmailIcon,
  LocationOnOutlined as LocationIcon,
  CalendarTodayOutlined as CalendarIcon,
  WorkOutlined as WorkIcon,
  DashboardCustomizeOutlined as BoardIcon,
  PeopleOutlined as TeamIcon,
  CheckCircleOutlined as TaskIcon,
  StarBorderOutlined as ScoreIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  ShareOutlined as ShareIcon,
  SaveOutlined as SaveIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // User Profile State (initial values read from localStorage or defaults)
  const [userProfile, setUserProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const parsed = savedUser ? JSON.parse(savedUser) : {};
    return {
      name: parsed.name || "Alex Johnson",
      email: parsed.email || "alex.johnson@example.com",
      role: "Senior Full-Stack Developer",
      location: "Mumbai, India",
      bio: "Full-stack enthusiast focused on building modern, real-time collaborative applications and high-performance user interfaces.",
      joinedDate: "January 2025",
      skills: ["React", "Node.js", "Material UI", "MongoDB", "WebSockets", "TypeScript", "Express"],
      website: "https://alexjohnson.dev",
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
    };
  });

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...userProfile });
  const [newSkillInput, setNewSkillInput] = useState("");

  // Snackbar State
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

  const handleOpenEditDialog = () => {
    setEditForm({ ...userProfile });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && newSkillInput.trim()) {
      e.preventDefault();
      if (!editForm.skills.includes(newSkillInput.trim())) {
        setEditForm((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkillInput.trim()],
        }));
      }
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editForm });
    // Update local storage name/email if present
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...existingUser,
        name: editForm.name,
        email: editForm.email,
      })
    );
    setEditDialogOpen(false);
    setSnackbar({
      open: true,
      message: "Profile updated successfully!",
      severity: "success",
    });
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({
      open: true,
      message: "Profile link copied to clipboard!",
      severity: "info",
    });
  };

  // Mock User Stats
  const stats = [
    { label: "Created Boards", count: "14", icon: <BoardIcon />, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Collaborators", count: "32", icon: <TeamIcon />, color: "#10B981", bg: "#ECFDF5" },
    { label: "Tasks Completed", count: "128", icon: <TaskIcon />, color: "#F59E0B", bg: "#FEF3C7" },
    { label: "Contribution Score", count: "96%", icon: <ScoreIcon />, color: "#EC4899", bg: "#FDF2F8" },
  ];

  // Mock Recent User Activity
  const recentActivities = [
    { id: 1, action: "Created new board", target: '"Real-time Dashboard UI"', time: "2 hours ago" },
    { id: 2, action: "Completed task", target: '"Integrate Socket.io WebSocket Connection"', time: "5 hours ago" },
    { id: 3, action: "Added team member", target: '"Sarah Jenkins to Sprint Workspace"', time: "1 day ago" },
    { id: 4, action: "Updated board settings", target: '"API Architecture Roadmap"', time: "2 days ago" },
  ];

  // Mock User Boards
  const userBoards = [
    { id: 1, title: "Real-time Dashboard UI", members: 5, category: "Frontend", updated: "2h ago" },
    { id: 2, title: "API Architecture Roadmap", members: 8, category: "Backend", updated: "1d ago" },
    { id: 3, title: "Sprint 24 Task Tracking", members: 4, category: "Management", updated: "3d ago" },
  ];

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
        {/* Profile Banner Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            mb: 3,
          }}
        >
          {/* Gradient Banner Cover */}
          <Box
            sx={{
              height: { xs: 120, sm: 180 },
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
              position: "relative",
            }}
          />

          {/* Profile Header Details */}
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3.5, pt: 0, position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-end" },
                justifyContent: "space-between",
                mt: { xs: "-50px", sm: "-60px" },
                mb: 2,
                gap: 2,
              }}
            >
              {/* Avatar with Status */}
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2.5 }}>
                <Avatar
                  sx={{
                    width: { xs: 90, sm: 110 },
                    height: { xs: 90, sm: 110 },
                    border: "4px solid #FFFFFF",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    bgcolor: "#6366F1",
                    fontSize: "2.25rem",
                    fontWeight: 700,
                  }}
                >
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
                
                <Box sx={{ display: { xs: "none", sm: "block" }, mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#3F342C" }}>
                    {userProfile.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "#64748B", fontWeight: 500 }}>
                    {userProfile.role}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleOpenEditDialog}
                  sx={{
                    backgroundColor: "#6366F1",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    textTransform: "none",
                    px: 2.5,
                    "&:hover": { backgroundColor: "#4F46E5" },
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={handleShareProfile}
                  sx={{
                    borderColor: "#E5E7EB",
                    color: "#3F342C",
                    borderRadius: 2.5,
                    textTransform: "none",
                    "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Box>

            {/* Mobile Title View */}
            <Box sx={{ display: { xs: "block", sm: "none" }, textAlign: "center", mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#3F342C" }}>
                {userProfile.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "#64748B" }}>
                {userProfile.role}
              </Typography>
            </Box>

            {/* User Meta Info Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
                color: "#64748B",
                fontSize: "0.875rem",
                pt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <EmailIcon fontSize="small" sx={{ color: "#6366F1" }} />
                <Typography variant="body2">{userProfile.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <LocationIcon fontSize="small" sx={{ color: "#6366F1" }} />
                <Typography variant="body2">{userProfile.location}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <CalendarIcon fontSize="small" sx={{ color: "#6366F1" }} />
                <Typography variant="body2">Joined {userProfile.joinedDate}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Stats Summary Bar */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {stats.map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#3F342C", mt: 0.5 }}>
                    {stat.count}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: stat.bg,
                    color: stat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Navigation Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
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
                color: "#64748B",
                "&.Mui-selected": {
                  color: "#6366F1",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#6366F1",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Overview & Bio" />
            <Tab label="My Boards" />
            <Tab label="Activity History" />
          </Tabs>
        </Paper>

        {/* TAB 0: OVERVIEW & BIO */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Bio & Skills Card */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 2 }}>
                  About Me
                </Typography>
                <Typography variant="body1" sx={{ color: "#4B5563", lineHeight: 1.7, mb: 3 }}>
                  {userProfile.bio}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 2 }}>
                  Skills & Expertise
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {userProfile.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        backgroundColor: "#EEF2FF",
                        color: "#6366F1",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderRadius: 2,
                        py: 0.5,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Social & Contact Card */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 3,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 2.5 }}>
                  Connected Links
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#F3F4F6", color: "#1F2937", width: 36, height: 36 }}>
                      <GitHubIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                        GitHub Profile
                      </Typography>
                      <Typography
                        component="a"
                        href={userProfile.github}
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                        sx={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}
                      >
                        {userProfile.github.replace("https://", "")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#EFF6FF", color: "#0077B5", width: 36, height: 36 }}>
                      <LinkedInIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                        LinkedIn Profile
                      </Typography>
                      <Typography
                        component="a"
                        href={userProfile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                        sx={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}
                      >
                        {userProfile.linkedin.replace("https://", "")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#ECFDF5", color: "#10B981", width: 36, height: 36 }}>
                      <WebsiteIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                        Personal Portfolio
                      </Typography>
                      <Typography
                        component="a"
                        href={userProfile.website}
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                        sx={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}
                      >
                        {userProfile.website.replace("https://", "")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: MY BOARDS */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {userBoards.map((board) => (
              <Grid item xs={12} sm={6} md={4} key={board.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#A5B4FC",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#3F342C" }}>
                      {board.title}
                    </Typography>
                    <Chip label={board.category} size="small" sx={{ backgroundColor: "#EEF2FF", color: "#6366F1", fontWeight: 600 }} />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                      {board.members} team members
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                      Updated {board.updated}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* TAB 2: ACTIVITY HISTORY */}
        {activeTab === 2 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3F342C", mb: 3 }}>
              Recent Activity Timeline
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentActivities.map((act) => (
                <Box
                  key={act.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    pb: 2,
                    borderBottom: "1px solid #F1F5F9",
                    "&:last-child": { borderBottom: "none", pb: 0 },
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#EEF2FF", color: "#6366F1", fontSize: "0.85rem" }}>
                    <TimeIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#3F342C" }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
                        {act.action}
                      </Typography>{" "}
                      {act.target}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                      {act.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      {/* EDIT PROFILE DIALOG */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#3F342C" }}>
          Edit Profile Information
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: "1px solid #F1F5F9", borderTop: "1px solid #F1F5F9" }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Role / Job Title
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="role"
                value={editForm.role}
                onChange={handleEditFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="location"
                value={editForm.location}
                onChange={handleEditFormChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Bio
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="bio"
                value={editForm.bio}
                onChange={handleEditFormChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>
                Skills (Press Enter to Add)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a skill and press Enter..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
                {editForm.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ backgroundColor: "#EEF2FF", color: "#6366F1", fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEditDialog} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            sx={{
              backgroundColor: "#6366F1",
              color: "#FFFFFF",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#4F46E5" },
            }}
          >
            Save Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
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

export default Profile;
