
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import Navbar from "../components/common/Navbar.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import MembersHeader from "../components/members/MembersHeader.jsx";
import MembersToolbar from "../components/members/MembersToolbar.jsx";
import MembersList from "../components/members/MembersList.jsx";
import AddMemberDialog from "../components/members/AddMemberDialog.jsx";

import {
  getMyWorkspaces,
  addWorkspaceMember,
} from "../api/workspaceApi.js";

export default function Members() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyWorkspaces();
      const list = Array.isArray(data) ? data : [];

      setWorkspaces(list);

      const selected =
        list.find((workspace) => workspace._id === workspaceId) ||
        list[0];

      setWorkspaceId(selected?._id || "");

      const workspaceMembers = selected?.members || [];
      setMembers(workspaceMembers);
    } 
catch (error) {
  console.error("Failed to load workspaces:", error);

  const status = error.response?.status;

  if (status === 401) {
    setError("Please log in again. Your session may have expired.");
  } else if (status === 403) {
    setError("You do not have permission to view these workspaces.");
  } else if (status === 404) {
    setError("Workspace API endpoint was not found.");
  } else if (status >= 500) {
    setError("Server error. Please try again later.");
  } else if (!error.response) {
    setError(
      "Cannot connect to the backend. Check whether the server is running."
    );
  } else {
    setError(
      error.response.data?.message ||
      "Failed to load workspace data."
    );
  }

  setWorkspaces([]);
  setMembers([]);
}
  }, [workspaceId]);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const user =
        member.user && typeof member.user === "object"
          ? member.user
          : {};

      const matchesSearch =
        `${user.name || ""} ${user.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const handleWorkspaceChange = (event) => {
    const id = event.target.value;
    setWorkspaceId(id);

    const selected = workspaces.find((item) => item._id === id);
    setMembers(selected?.members || []);
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setInviteLoading(true);
    setError("");
    setNotice("");

    try {
      await addWorkspaceMember(workspaceId, {
        email: email.trim(),
        role,
      });

      setDialogOpen(false);
      setEmail("");
      setRole("member");
      setNotice("Member added successfully.");

      await loadWorkspaces();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add member. Check whether the backend endpoint exists."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAF8F6" }}>
      <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          mt: "72px",
          ml: { xs: "72px", md: sidebarOpen ? "256px" : "72px" },
          p: { xs: 2, md: 4 },
        }}
      >
        <MembersHeader
          onRefresh={loadWorkspaces}
          onAddMember={() => setDialogOpen(true)}
          loading={loading}
          disabled={!workspaceId}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {notice && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{ p: 2, mb: 3, border: "1px solid #EEE5DE" }}
        >
          <Typography fontWeight={600} mb={1} color="#3F342C">
            Select Workspace
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            value={workspaceId}
            onChange={handleWorkspaceChange}
            disabled={!workspaces.length}
          >
            {workspaces.map((workspace) => (
              <MenuItem key={workspace._id} value={workspace._id}>
                {workspace.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="body2" color="text.secondary" mt={1}>
            {members.length} members
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{ border: "1px solid #EEE5DE", borderRadius: 2 }}
        >
          <MembersToolbar
            search={search}
            setSearch={setSearch}
            role={roleFilter}
            setRole={setRoleFilter}
          />

          <MembersList
            members={filteredMembers}
            loading={loading}
            error=""
          />
        </Paper>

        <AddMemberDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleAddMember}
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
          loading={inviteLoading}
        />
      </Box>
    </Box>
  );
}