import { Box, Typography } from "@mui/material";

import BoardCard from "./BoardCard";

const BoardsGrid = ({
  boards = [],
  onOpenBoard,
  onBoardMenuClick,
  onUpdated,
  onDeleted,
}) => {
  if (boards.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#3F342C",
          }}
        >
          No boards found
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "14px",
            color: "#99918B",
          }}
        >
          Create a board to start collaborating with your team.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {boards.map((board) => (
        <BoardCard
          key={board._id}
          board={board}
          onOpen={onOpenBoard}
          onMenuClick={onBoardMenuClick}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </Box>
  );
};

export default BoardsGrid;