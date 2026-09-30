
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

export default function AddMemberDialog({
  open,
  onClose,
  onSubmit,
  email,
  setEmail,
  role,
  setRole,
  loading,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ color: "#3F342C" }}>
          Add Workspace Member
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            required
            type="email"
            label="Member email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Role"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email.trim()}
            sx={{ bgcolor: "#A9744F", "&:hover": { bgcolor: "#8E5D3C" } }}
          >
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}