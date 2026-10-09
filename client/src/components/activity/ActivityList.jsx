
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Skeleton,
} from "@mui/material";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/History";

const COLORS = {
  primary: "#A9744F",
  text: "#3F342C",
  secondary: "#77716C",
  border: "#E8E3DE",
  light: "#F9F3EE",
};

const getActivityIcon = (type = "") => {
  const value = type.toUpperCase();

  if (value.includes("COMMENT")) return <CommentOutlinedIcon />;
  if (value.includes("MEMBER")) return <PersonAddOutlinedIcon />;
  if (value.includes("DELETE") || value.includes("REMOVED")) {
    return <DeleteOutlineOutlinedIcon />;
  }
  if (value.includes("MOVE")) return <SwapHorizOutlinedIcon />;
  if (value.includes("CREATE") || value.includes("ADD")) {
    return <AddBoxOutlinedIcon />;
  }
  if (value.includes("BOARD")) return <ViewKanbanOutlinedIcon />;

  return <EditOutlinedIcon />;
};

const getCategory = (activity) => {
  const type = String(activity.type || "").toLowerCase();

  if (type.includes("comment")) return "Comment";
  if (type.includes("member")) return "Member";
  if (type.includes("card") || type.includes("task")) return "Card";
  if (type.includes("list")) return "List";
  if (type.includes("board")) return "Board";
  if (type.includes("workspace")) return "Workspace";

  return "Activity";
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ActivityList = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <Card
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(63,52,44,0.04)",
        }}
      >
        <CardContent>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box
              key={item}
              sx={{ display: "flex", gap: 2, mb: 3 }}
            >
              <Skeleton variant="circular" width={44} height={44} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="45%" />
                <Skeleton width="75%" />
                <Skeleton width="30%" />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(63,52,44,0.04)",
        }}
      >
        <CardContent
          sx={{
            py: 8,
            textAlign: "center",
          }}
        >
          <HistoryOutlinedIcon
            sx={{ fontSize: 48, color: "#C9B6A7", mb: 1 }}
          />

          <Typography
            sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5 }}
          >
            No activities found
          </Typography>

          <Typography sx={{ color: COLORS.secondary, fontSize: 14 }}>
            Your workspace activity will appear here when available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(63,52,44,0.04)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {activities.map((activity, index) => {
          const userName =
            activity.user?.name ||
            activity.actor?.name ||
            activity.userName ||
            "User";

          const message =
            activity.message ||
            activity.description ||
            activity.action ||
            "Activity recorded";

          const boardName =
            activity.board?.name ||
            activity.boardName ||
            "";

          const key =
            activity._id ||
            activity.id ||
            `${activity.type}-${activity.createdAt}-${index}`;

          return (
            <Box key={key}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: { xs: 1.5, sm: 2 },
                  py: 2,
                }}
              >
                <Avatar
                  src={activity.user?.avatar || activity.actor?.avatar || ""}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: COLORS.light,
                    color: COLORS.primary,
                    fontWeight: 700,
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: COLORS.text,
                      fontSize: 14,
                      lineHeight: 1.7,
                      overflowWrap: "anywhere",
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {userName}
                    </Box>{" "}
                    {message}
                  </Typography>

                  {boardName && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        color: COLORS.secondary,
                      }}
                    >
                      Board: {boardName}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      size="small"
                      label={getCategory(activity)}
                      sx={{
                        height: 24,
                        color: COLORS.primary,
                        bgcolor: COLORS.light,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />

                    <Typography
                      component="time"
                      sx={{ fontSize: 12, color: COLORS.secondary }}
                    >
                      {formatDate(activity.createdAt || activity.updatedAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: COLORS.light,
                    color: COLORS.primary,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Box>
              </Box>

              {index < activities.length - 1 && (
                <Divider sx={{ borderColor: "#EEE9E4" }} />
              )}
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActivityList;