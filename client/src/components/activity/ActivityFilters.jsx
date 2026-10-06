
import { Box, MenuItem, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InputAdornment from "@mui/material/InputAdornment";

const ActivityFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search activities..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        size="small"
        sx={{
          flex: 1,
          minWidth: 220,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
            "& fieldset": { borderColor: "#E8E3DE" },
            "&:hover fieldset": { borderColor: "#A9744F" },
            "&.Mui-focused fieldset": { borderColor: "#A9744F" },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: "#A9744F" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        size="small"
        label="Activity type"
        value={type}
        onChange={(event) => onTypeChange(event.target.value)}
        sx={{
          minWidth: 180,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E8E3DE",
          },
        }}
      >
        <MenuItem value="all">All activities</MenuItem>
        <MenuItem value="board">Boards</MenuItem>
        <MenuItem value="card">Cards and tasks</MenuItem>
        <MenuItem value="comment">Comments</MenuItem>
        <MenuItem value="member">Members</MenuItem>
        <MenuItem value="list">Lists</MenuItem>
        <MenuItem value="workspace">Workspace</MenuItem>
      </TextField>
    </Box>
  );
};

export default ActivityFilters;