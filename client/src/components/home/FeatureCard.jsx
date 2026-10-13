import { Box, Paper, Typography } from "@mui/material";
import ViewKanbanOutlined from "@mui/icons-material/ViewKanbanOutlined";
import ChatBubbleOutlined from "@mui/icons-material/ChatBubbleOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { BRAND } from "./homeContent";

// Lookup table (object map): resolves a string key to a component without a long if/else chain.
const ICONS = {
  boards: ViewKanbanOutlined,
  chat: ChatBubbleOutlined,
  documents: DescriptionOutlined,
  notifications: NotificationsActiveOutlined,
  members: GroupsOutlined,
  activity: HistoryOutlined,
};

const FeatureCard = ({ iconKey, title, description }) => {
  const Icon = ICONS[iconKey] ?? ViewKanbanOutlined;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${BRAND.border}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(169,116,79,0.15)",
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          backgroundColor: BRAND.tint,
          color: BRAND.primary,
        }}
      >
        <Icon />
      </Box>

      <Typography
        component="h3"
        sx={{ fontWeight: 700, fontSize: 18, color: BRAND.textDark }}
      >
        {title}
      </Typography>

      <Typography
        sx={{ mt: 1, fontSize: 14.5, lineHeight: 1.7, color: BRAND.textMuted }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default FeatureCard;
