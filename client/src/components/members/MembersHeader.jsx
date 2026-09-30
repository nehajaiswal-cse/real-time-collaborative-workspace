
import { Box, Button, Stack, Typography } from "@mui/material";
import { Add, Groups, Refresh } from "@mui/icons-material";

export default function MembersHeader({
  onRefresh,
  onAddMember,
  loading = false,
  disabled = false,
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(0, 1fr) auto",
        },
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        gap: 2,
        mb: 3,
      }}
    >
      {/* LEFT: Heading */}
      <Box sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Groups
            sx={{
              color: "#A9744F",
              fontSize: 32,
              flexShrink: 0,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "#3F342C",
            }}
          >
            Members
          </Typography>
        </Stack>

        <Typography
          sx={{
            color: "#81766D",
            mt: 0.5,
          }}
        >
          Manage your workspace team.
        </Typography>
      </Box>

      {/* RIGHT: Buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifySelf: { xs: "start", sm: "end" },
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            minHeight: 48,
            px: 2,
            color: "#3F342C",
            borderColor: "#D9C8BB",
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#A9744F",
              bgcolor: "#F8F1EB",
            },
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddMember}
          disabled={disabled}
          sx={{
            minHeight: 48,
            px: 2,
            bgcolor: "#A9744F",
            color: "#FFFFFF",
            textTransform: "none",
            whiteSpace: "nowrap",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#8E5D3C",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#E0D0C3",
              color: "#A49A92",
            },
          }}
        >
          Add Member
        </Button>
      </Stack>
    </Box>
  );
}

