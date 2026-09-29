
import { Box, Button, Stack, Typography } from "@mui/material";
import { Add, Groups, Refresh } from "@mui/icons-material";

export default function MembersHeader({
  onRefresh,
  onAddMember,
  loading,
  disabled,
}) {
  return (
    <Stack
    minheight="100vh"
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      mb={3}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Groups sx={{ color: "#A9744F", fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{ fontFamily: "Georgia, serif", fontWeight: 700, color: "#3F342C" }}
          >
            Members
          </Typography>
        </Stack>
        <Typography sx={{ color: "#81766D", mt: 0.5 }}>
          Manage your workspace team.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          variant="outlined"
          sx={{ color: "#3F342C", borderColor: "#D9C8BB", textTransform: "none" }}
        >
          Refresh
        </Button>

        <Button
          startIcon={<Add />}
          onClick={onAddMember}
          disabled={disabled}
          variant="contained"
          sx={{
            bgcolor: "#A9744F",
            "&:hover": { bgcolor: "#8E5D3C" },
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          Add Member
        </Button>
      </Stack>
    </Stack>
  );
}