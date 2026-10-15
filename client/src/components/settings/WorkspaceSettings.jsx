import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useState } from "react";
import SettingsCard from "./SettingsCard.jsx";

const DetailRow = ({ label, children, bold = false }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        mb: 0.5,
        color: "#77716C",
        letterSpacing: "0.06em",
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant={bold ? "body1" : "body2"}
      sx={{
        color: "#3F342C",
        fontWeight: bold ? 700 : 400,
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const WorkspaceSettings = ({
  workspaces = [],
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
      setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      console.error("Unable to copy workspace ID:", copyError);
    }
  };

  return (
    <SettingsCard
      icon={BusinessOutlinedIcon}
      title="Workspace settings"
      subtitle="View your available workspaces"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
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
            size="small"
            label="Select workspace"
            value={workspaceId || ""}
            onChange={(event) => onWorkspaceChange?.(event.target.value)}
            sx={{ mb: 2.5 }}
          >
            {workspaces.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          {workspace && (
            <Stack
              spacing={2.5}
              sx={{
                p: 2.5,
                border: "1px solid #E8E3DE",
                borderRadius: 2,
                bgcolor: "#FFFCFA",
              }}
            >
              <DetailRow label="WORKSPACE NAME" bold>
                {workspace.name || "Unnamed workspace"}
              </DetailRow>

              <DetailRow label="DESCRIPTION">
                {workspace.description || "No description provided."}
              </DetailRow>

              <DetailRow label="WORKSPACE ID">
                {workspace._id}
              </DetailRow>

              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCopyId}
                  startIcon={
                    copied ? <CheckOutlinedIcon /> : <ContentCopyOutlinedIcon />
                  }
                  sx={{
                    flexShrink: 0,
                    minWidth: 88,
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: copied ? "#4E8B57" : "#D8C9BE",
                    color: copied ? "#4E8B57" : "#8B5E3C",
                    "&:hover": {
                      borderColor: "#A9744F",
                      bgcolor: "rgba(169,116,79,0.06)",
                    },
                  }}
                >
                  {copied ? "Copied" : "Copy ID"}
                </Button>
              </Box>
            </Stack>
          )}

          <Alert severity="info" sx={{ mt: 2.5, alignItems: "center" }}>
            Workspace details are read-only. Updating a workspace requires a
            backend update endpoint, which is not present in the current
            backend routes.
          </Alert>
        </>
      )}
    </SettingsCard>
  );
};

export default WorkspaceSettings;
