
import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import socket from "../../socket";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const open = Boolean(anchorEl);

  const loadUnreadCount = async () => {
    try {
      const result = await getUnreadCount();
      setUnreadCount(result.count);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getNotifications();
      console.log("Loaded notifications:", result.notifications);

      setNotifications(result.notifications || []);
      setUnreadCount(
        (result.notifications || []).filter(
          (notification) => !notification.isRead
        ).length
      );
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    const handleNewNotification = (notification) => {
      setNotifications((previous) => {
        if (
          previous.some(
            (item) => item._id === notification._id
          )
        ) {
          return previous;
        }

        return [notification, ...previous].slice(0, 50);
      });

      if (!notification.isRead) {
        setUnreadCount((count) => count + 1);
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    const selected = notifications.find(
      (item) => item._id === notificationId
    );

    if (!selected || selected.isRead) return;

    try {
      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notificationId
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Notifications"
        sx={{ color: "#ffffff" }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxWidth: "calc(100vw - 24px)",
              maxHeight: 460,
              mt: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          <Typography fontWeight={700}>
            Notifications
          </Typography>

          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            disabled={unreadCount === 0}
            onClick={handleMarkAllAsRead}
          >
            Read all
          </Button>
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <NotificationsNoneIcon
              sx={{ fontSize: 36, color: "text.secondary" }}
            />
            <Typography fontWeight={600}>
              You're all caught up!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New notifications will appear here.
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() =>
                handleMarkAsRead(notification._id)
              }
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                py: 1.5,
                bgcolor: notification.isRead
                  ? "transparent"
                  : "action.hover",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="body2"
                  fontWeight={notification.isRead ? 400 : 700}
                >
                  {notification.message}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {notification.workspace?.name || "Workspace"}{" "}
                  ·{" "}
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
