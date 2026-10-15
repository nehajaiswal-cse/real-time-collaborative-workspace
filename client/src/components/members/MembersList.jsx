
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Groups from "@mui/icons-material/Groups";

import usePresence from "../../hooks/usePresence";


export default function MembersList({ members, loading, error,workspaceId }) {
  const onlineUsers = usePresence(workspaceId);
   console.log("workspaceId:", workspaceId);
  console.log("loading:", loading);
  console.log("error:", error);
  console.log("members:", members);
  console.log("onlineUsers:", onlineUsers);

  if (loading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress sx={{ color: "#A9744F" }} />
        <Typography mt={2}>Loading members...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!members.length) {
    return (
      <Stack alignItems="center" py={6} spacing={1}>
        <Groups sx={{ fontSize: 44, color: "#A9744F" }} />
        <Typography fontWeight={600}>No members found</Typography>
        <Typography color="text.secondary" variant="body2">
          No member records were returned by your backend.
        </Typography>
      </Stack>
    );
  }

  return (
    <Paper elevation={0}>
      {members.map((member, index) => {
        const user =
          member.user && typeof member.user === "object"
            ? member.user
            : {};
        console.log(
  "Member user IDs:",
  members.map((member) => ({
    name: member.user?.name,
    id: String(member.user?._id || member.user?.id || ""),
  }))
);

console.log("Online user IDs:", onlineUsers);    
        
        const userId = String(user._id || user.id || "");
        const name = user.name || "Unknown user";
        const role = member.role || "member";
        const isOnline = userId !== "" && onlineUsers.includes(userId);
        return (
          <Box
            key={user._id || user.email || index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderBottom: "1px solid #EEE5DE",
              "&:hover": { bgcolor: "#FAF8F6" },
            }}
          >
            <Avatar sx={{ bgcolor: "#F0E5DC", color: "#A9744F" }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Box
                title={isOnline ? "Online" : "Offline"}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: isOnline ? "#22C55E" : "#9CA3AF",
                  border: "2px solid white",
                }}
              ></Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={600} color="#3F342C">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email || "Email unavailable"}
              </Typography>
              <Typography
  variant="caption"
  sx={{
    color: isOnline ? "#16A34A" : "text.secondary",
    fontWeight: 500,
  }}
>
  {isOnline ? "Online" : "Offline"}
</Typography>
            </Box>

            <Chip
              label={role.charAt(0).toUpperCase() + role.slice(1)}
              size="small"
              sx={{ bgcolor: "#F0E5DC", color: "#875633" }}
            />
          </Box>
        );
      })}
    </Paper>
  );
}