import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  updateBoard,
  deleteBoard,
} from "../../api/boardApi.js";

const BoardCard = ({
  board,
  onOpen,
  onUpdated,
  onDeleted,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState(board?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open edit dialog
  const handleEdit = () => {
    handleMenuClose();
    setName(board?.name || "");
    setError("");
    setEditOpen(true);

    // Preserve an existing parent edit callback, if provided.
    onEdit?.(board);
  };

  // Update board through backend
  const handleUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Board name is required.");
      return;
    }

    if (!board?._id) {
      setError("Board ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await updateBoard(board._id, {
        name: trimmedName,
      });

      setEditOpen(false);

      // Refresh the parent list using its callback.
      onUpdated?.(result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update board. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const handleDelete = () => {
    handleMenuClose();
    setError("");
    setDeleteOpen(true);

    onDelete?.(board);
  };

  // Delete board through backend
  const handleConfirmDelete = async () => {
    if (!board?._id) {
      setError("Board ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteBoard(board._id);

      setDeleteOpen(false);
      console.log("ondeleted", onDeleted);

      // Refresh the parent list after deletion.
      onDeleted?.(board._id);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete board. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          borderRadius: "14px",
          border: "1px solid #E8E3DE",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(63, 52, 44, 0.04)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 18px rgba(63, 52, 44, 0.08)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            "&:last-child": { pb: 2.5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "11px",
                backgroundColor: "#F4ECE6",
                color: "#A9744F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ViewKanbanOutlinedIcon />
            </Box>

            <IconButton
              size="small"
              aria-label="Board options"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>
                <EditOutlinedIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />
                Edit Board
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleDelete}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />
                Delete Board
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontSize: "17px",
              fontWeight: 700,
              color: "#3F342C",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {board?.name || "Untitled Board"}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: "13px",
              color: "#99918B",
            }}
          >
            Created{" "}
            {board?.createdAt
              ? new Date(board.createdAt).toLocaleDateString()
              : "—"}
          </Typography>

          <Box
            component="button"
            onClick={() => onOpen?.(board)}
            sx={{
              mt: 2.5,
              width: "100%",
              border: "none",
              background: "transparent",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              color: "#A9744F",
            }}
          >
            <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
              Open Board
            </Typography>

            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Edit Board Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => !loading && setEditOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit Board</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Board name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) {
                handleUpdate();
              }
            }}
            margin="dense"
            inputProps={{ maxLength: 100 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setEditOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => !loading && setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Board?</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}

          <Typography>
            Are you sure you want to delete{" "}
            <strong>{board?.name || "this board"}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoardCard;