import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useState } from "react";

const WorkspaceSettings = ({
  workspaces,
  workspaceId,
  onWorkspaceChange,
  loading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const workspace =
    workspaces.find((item) => item._id === workspaceId) || null;

  const handleCopyId = async () => {
    if (!workspace?._id) return;

    try {
      await navigator.clipboard.writeText(workspace._id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Unable to copy workspace ID:", error);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        border: "1px solid #E8E3DE",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <BusinessOutlinedIcon
          sx={{ color: "#A9744F", fontSize: 27 }}
        />

        <Box>
          <Typography
            fontWeight={700}
            color="#3F342C"
            fontSize={18}
          >
            Workspace
          </Typography>

          <Typography variant="body2" color="#77716C">
            View your workspace information
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress sx={{ color: "#A9744F" }} />
        </Box>
      ) : workspaces.length === 0 ? (
        <Alert severity="info">
          No workspace is available for your account.
        </Alert>
      ) : (
        <>
          <TextField
            select
            fullWidth
            label="Select workspace"
            size="small"
            value={workspaceId}
            onChange={(event) =>
              onWorkspaceChange(event.target.value)
            }
            sx={{ mb: 2.5 }}
          >
            {workspaces.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          {workspace && (
            <Box
              sx={{
                p: 2,
                border: "1px solid #E8E3DE",
                borderRadius: 2,
                bgcolor: "#FFFCFA",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#8A817A",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                WORKSPACE
              </Typography>

              <Typography
                fontWeight={700}
                color="#3F342C"
                fontSize={17}
                mb={2}
              >
                {workspace.name || "Unnamed workspace"}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#8A817A",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                DESCRIPTION
              </Typography>

              <Typography
                color="#5F5751"
                mb={2}
              >
                {workspace.description ||
                  "No description provided."}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#8A817A",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                WORKSPACE ID
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 0.5 }}
              >
                <Typography
                  variant="body2"
                  color="#77716C"
                  sx={{
                    overflowWrap: "anywhere",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {workspace._id}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCopyId}
                  startIcon={
                    copied ? (
                      <CheckOutlinedIcon />
                    ) : (
                      <ContentCopyOutlinedIcon />
                    )
                  }
                  sx={{
                    flexShrink: 0,
                    minWidth: 88,
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: copied
                      ? "#4E8B57"
                      : "#D8C9BE",
                    color: copied
                      ? "#4E8B57"
                      : "#8B5E3C",
                    "&:hover": {
                      borderColor: "#A9744F",
                      bgcolor: "rgba(169,116,79,0.06)",
                    },
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default WorkspaceSettings;