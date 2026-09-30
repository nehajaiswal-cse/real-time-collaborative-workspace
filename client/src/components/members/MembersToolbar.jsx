
import { Stack, TextField, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function MembersToolbar({
  search,
  setSearch,
  role,
  setRole,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ p: 2 }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ mr: 1, color: "#A9744F" }} />
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ minWidth: { sm: 150 } }}
      >
        <MenuItem value="all">All roles</MenuItem>
        <MenuItem value="owner">Owner</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="member">Member</MenuItem>
      </TextField>
    </Stack>
  );
}