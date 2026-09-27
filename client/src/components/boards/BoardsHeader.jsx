import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const BoardsHeader = ({ onCreateBoard }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#3F342C",
            fontFamily: "Georgia, serif",
          }}
        >
          My Boards
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "14px",
            color: "#77716C",
          }}
        >
          Manage and collaborate on your workspace boards.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateBoard}
        sx={{
          backgroundColor: "#A9744F",
          color: "#FFFFFF",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          px: 2.5,
          py: 1.2,
          boxShadow: "none",

          "&:hover": {
            backgroundColor: "#8F5F3F",
            boxShadow: "none",
          },
        }}
      >
        Create Board
      </Button>
    </Box>
  );
};

export default BoardsHeader;