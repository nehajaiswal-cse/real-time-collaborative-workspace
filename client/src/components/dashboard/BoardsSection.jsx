import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BoardsSection = ({
  boards = [],
  onCreateBoard,
  onViewAll,
}) => {
  return (
    <Box sx={{ mt: 4, width: "100%" }}>

      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Left */}
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Your Boards
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage and collaborate on your projects
          </Typography>
        </Box>

        {/* Right */}
        <Stack direction="row" spacing={1}>

          {/* Create Board - Outlined */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={onCreateBoard}
            sx={{
              color: "#a9744f",
              borderColor: "#a9744f",
              textTransform: "none",

              "&:hover": {
                borderColor: "#8b5e3c",
                backgroundColor: "rgba(169, 116, 79, 0.08)",
              },
            }}
          >
            Create Board
          </Button>

          {/* View All */}
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={onViewAll}
            sx={{
              color: "#a9744f",
              textTransform: "none",

              "&:hover": {
                backgroundColor: "rgba(169, 116, 79, 0.08)",
              },
            }}
          >
            View All
          </Button>

        </Stack>
      </Box>

      {/* Boards / Empty State */}
      {boards.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            py: 5,
            textAlign: "center",
            borderColor: "#e5e7eb",
          }}
        >
          <CardContent>

            <Typography variant="body1" fontWeight={500}>
              No boards available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Create a board to start managing your project.
            </Typography>

            {/* Create Board - Main Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 2,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,

                background:
                  "linear-gradient(135deg, #a9744f, #8b5e3c)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #8b5e3c, #6f472f)",
                },
              }}
              onClick={onCreateBoard}
            >
              Create Board
            </Button>

          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={board.id}
            >
              {/* board card */}
            </Grid>
          ))}
        </Grid>
      )}

    </Box>
  );
};

export default BoardsSection;