
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

const activityIcons = {
  BOARD_CREATED: <AddTaskOutlinedIcon />,
  CARD_CREATED: <AddTaskOutlinedIcon />,
  CARD_UPDATED: <EditOutlinedIcon />,
  CARD_MOVED: <SwapHorizOutlinedIcon />,
  COMMENT_ADDED: <CommentOutlinedIcon />,
  MEMBER_ADDED: <PersonAddOutlinedIcon />,
};

const RecentActivity = ({ activities = [] }) => {
  const navigate = useNavigate();

  // Sort newest first and display only five activities.
  const recentActivities = [...activities]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: "14px",
        border: "1px solid #E8E3DE",
        boxShadow: "0 2px 8px rgba(63, 52, 44, 0.04)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#3F342C",
            }}
          >
            Recent Activity
          </Typography>

          <Button
            onClick={() => navigate("/activity")}
            endIcon={<ArrowForwardOutlinedIcon />}
            sx={{
              color: "#A9744F",
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "#F9F3EE",
                color: "#8B5E3C",
              },
            }}
          >
            View All
          </Button>
        </Box>

        {recentActivities.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: "#99918B" }}>
              No recent activity
            </Typography>
          </Box>
        ) : (
          <Box>
            {recentActivities.map((activity, index) => {
              const userName =
                activity.user?.name ||
                activity.actor?.name ||
                activity.userName ||
                "User";

              const message =
                activity.message ||
                activity.description ||
                activity.action ||
                "performed an activity";

              const avatar =
                activity.user?.avatar ||
                activity.actor?.avatar ||
                "";

              const activityId =
                activity._id ||
                activity.id ||
                `${activity.type}-${activity.createdAt}-${index}`;

              return (
                <React.Fragment key={activityId}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1.5,
                    }}
                  >
                    <Avatar
                      src={avatar}
                      alt={userName}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#F4ECE6",
                        color: "#A9744F",
                        fontWeight: 600,
                      }}
                    >
                      {!avatar && userName.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: "#3F342C",
                          overflowWrap: "anywhere",
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {userName}
                        </Box>{" "}
                        {message}
                      </Typography>

                      {activity.board?.name && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#77716C",
                            mt: 0.5,
                          }}
                        >
                          Board: {activity.board.name}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#99918B",
                          mt: 0.5,
                        }}
                      >
                        {activity.createdAt &&
                        !Number.isNaN(new Date(activity.createdAt).getTime())
                          ? new Date(activity.createdAt).toLocaleString()
                          : ""}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "10px",
                        backgroundColor: "#F4ECE6",
                        color: "#A9744F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {activityIcons[activity.type] || (
                        <EditOutlinedIcon />
                      )}
                    </Box>
                  </Box>

                  {index < recentActivities.length - 1 && (
                    <Divider sx={{ borderColor: "#EEE9E4" }} />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;