import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BoardCard = ({ board, onOpen, onMenuClick }) => {
  return (
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
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        {/* Header */}
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
            onClick={(event) => onMenuClick?.(event, board)}
            sx={{
              color: "#77716C",

              "&:hover": {
                backgroundColor: "#F4ECE6",
                color: "#A9744F",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Board information */}
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

        {/* Open board */}
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
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Open Board
          </Typography>

          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BoardCard;