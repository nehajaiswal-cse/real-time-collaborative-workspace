
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

export default function MembersList({ members, loading, error }) {
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

        const name = user.name || "Unknown user";
        const role = member.role || "member";

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

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={600} color="#3F342C">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email || "Email unavailable"}
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