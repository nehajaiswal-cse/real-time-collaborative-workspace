import { Grid } from "@mui/material";

import OverviewCard from "./OverviewCard";

import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";

const OverviewCards = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <OverviewCard
          title="Total Boards"
          value={12}
          icon={<ViewKanbanIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <OverviewCard
          title="Total Cards"
          value={48}
          icon={<AssignmentIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <OverviewCard
          title="Members"
          value={8}
          icon={<PeopleIcon />}
        />
      </Grid>
    </Grid>
  );
};

export default OverviewCards;