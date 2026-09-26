import React from "react";
import {
  Avatar,
  Box,
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

const activityIcons = {
  CARD_CREATED: <AddTaskOutlinedIcon />,
  CARD_UPDATED: <EditOutlinedIcon />,
  CARD_MOVED: <SwapHorizOutlinedIcon />,
  COMMENT_ADDED: <CommentOutlinedIcon />,
  MEMBER_ADDED: <PersonAddOutlinedIcon />,
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: "14px",
        border: "1px solid #E8E3DE",
        boxShadow: "0 2px 8px rgba(63, 52, 44, 0.04)",
      }}
    >
      <CardContent sx={{ p: 3 }}>

        {/* Header */}
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#3F342C",
            mb: 2,
          }}
        >
          Recent Activity
        </Typography>

        {activities.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#99918B",
              }}
            >
              No recent activity
            </Typography>
          </Box>
        ) : (
          <Box>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                  }}
                >

                  {/* User Avatar */}
                  <Avatar
                    src={activity.user?.avatar || ""}
                    alt={activity.user?.name || "User"}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#F4ECE6",
                      color: "#A9744F",
                      fontWeight: 600,
                    }}
                  >
                    {!activity.user?.avatar &&
                      (
                        activity.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"
                      )}
                  </Avatar>

                  {/* Activity Details */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#3F342C",
                      }}
                    >
                      <strong>
                        {activity.user?.name || "User"}
                      </strong>{" "}
                      {activity.message}
                    </Typography>

                    {/* Board */}
                    {activity.board?.name && (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#77716C",
                          mt: 0.5,
                        }}
                      >
                        Board: {activity.board.name}
                      </Typography>
                    )}

                    {/* Date */}
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#99918B",
                        mt: 0.5,
                      }}
                    >
                      {activity.createdAt
                        ? new Date(
                            activity.createdAt
                          ).toLocaleString()
                        : ""}
                    </Typography>
                  </Box>

                  {/* Activity Icon */}
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

                      transition: "all 0.2s ease",

                      "&:hover": {
                        backgroundColor: "#E8D8CC",
                        color: "#8B5E3C",
                      },
                    }}
                  >
                    {activityIcons[activity.type] || (
                      <EditOutlinedIcon />
                    )}
                  </Box>
                </Box>

                {/* Divider */}
                {index < activities.length - 1 && (
                  <Divider
                    sx={{
                      borderColor: "#EEE9E4",
                    }}
                  />
                )}

              </React.Fragment>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;