
import { Box } from "@mui/material";

import OverviewCard from "./OverviewCard";

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

const OverviewCards = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      <OverviewCard
        title="Total Boards"
        value={12}
        icon={<ViewKanbanIcon />}
      />

      <OverviewCard
        title="Total Cards"
        value={48}
        icon={<AssignmentIcon />}
      />

      <OverviewCard
        title="Members"
        value={8}
        icon={<PeopleIcon />}
      />
    </Box>
  );
};

export default OverviewCards;