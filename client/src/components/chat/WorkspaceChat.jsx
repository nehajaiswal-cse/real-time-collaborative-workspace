import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import socket from "../../socket";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COLORS = {
  primary: "#A9714F",
  primaryDark: "#875638",
  background: "#FAF7F3",
  surface: "#FFFFFF",
  ownMessage: "#A9714F",
  otherMessage: "#F1EAE3",
  text: "#292521",
  muted: "#888078",
  border: "#EAE2D9",
};

function formatTime(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function WorkspaceChat({ workspaceId, workspaceName = "Workspace" }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch messages from the backend.
  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
      if (!workspaceId || !token) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${API_URL}/messages/workspace/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!cancelled) {
          setMessages(response.data.messages || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load messages. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, token]);

  // Connect to Socket.IO and join the workspace.
  useEffect(() => {
    if (!workspaceId || !token) return;

    const handleConnect = () => {
      socket.emit("workspace:join", workspaceId);
    };

    const handleNewMessage = (message) => {
      const messageWorkspaceId = message.workspace?._id || message.workspace;

      if (
        messageWorkspaceId &&
        messageWorkspaceId.toString() !== workspaceId.toString()
      ) {
        return;
      }

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => item._id === message._id,
        );

        if (alreadyExists) return previousMessages;

        return [...previousMessages, message];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("chat:message", handleNewMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chat:message", handleNewMessage);

      if (socket.connected) {
        socket.emit("workspace:leave", workspaceId);
      }
    };
  }, [workspaceId, token]);

  // Scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Send a message through the existing REST API.
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || !workspaceId || !token || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/messages/workspace/${workspaceId}`,
        {
          content: trimmedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newMessage = response.data.message;

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (message) => message._id === newMessage._id,
        );

        if (alreadyExists) return previousMessages;

        return [...previousMessages, newMessage];
      });

      setContent("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Message could not be sent. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        height: { xs: 480, md: 560 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "18px",
        bgcolor: COLORS.surface,
        boxShadow: "0 5px 24px rgba(70, 45, 25, 0.045)",
      }}
    >
      {/* Chat header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 2,
          borderBottom: `1px solid ${COLORS.border}`,
          bgcolor: "#FFFEFC",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            bgcolor: "#F3E8DD",
            color: COLORS.primaryDark,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <ForumRoundedIcon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 750,
              fontSize: "1rem",
              color: COLORS.text,
            }}
          >
            {workspaceName}
          </Typography>

          <Typography variant="caption" sx={{ color: COLORS.muted }}>
            Team conversation
          </Typography>
        </Box>

        <Tooltip title="Reload conversation">
          <IconButton
            aria-label="Reload conversation"
            onClick={() => {
              setLoading(true);

              axios
                .get(`${API_URL}/workspace/${workspaceId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => {
                  setMessages(response.data.messages || []);
                  setError("");
                })
                .catch((err) => {
                  setError(
                    err.response?.data?.message || "Unable to reload messages.",
                  );
                })
                .finally(() => setLoading(false));
            }}
            sx={{
              color: COLORS.primary,
              "&:hover": { bgcolor: "#F8F0E8" },
            }}
          >
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Messages area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: { xs: 1.5, sm: 2.5 },
          py: 2.5,
          bgcolor: COLORS.background,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#D9C9B9",
            borderRadius: "10px",
          },
        }}
      >
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ height: "100%", minHeight: 150 }}
          >
            <CircularProgress size={28} sx={{ color: COLORS.primary }} />

            <Typography variant="body2" color="text.secondary">
              Loading conversation...
            </Typography>
          </Stack>
        ) : error && messages.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ height: "100%", minHeight: 150 }}
          >
            <Typography color="error" variant="body2" textAlign="center">
              {error}
            </Typography>

            <Button
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => window.location.reload()}
              sx={{ color: COLORS.primary }}
            >
              Retry
            </Button>
          </Stack>
        ) : messages.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ height: "100%", minHeight: 180 }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "22px",
                display: "grid",
                placeItems: "center",
                bgcolor: "#F0E4D8",
                color: COLORS.primaryDark,
              }}
            >
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 30 }} />
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                color: COLORS.text,
                fontSize: "1rem",
              }}
            >
              Start a conversation
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: COLORS.muted,
                textAlign: "center",
                maxWidth: 260,
              }}
            >
              Share updates, ask questions, and keep your team in sync.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((message, index) => {
              const senderId =
                message.sender?._id || message.sender?.id || message.sender;

              const currentUserId = currentUser?._id || currentUser?.id;

              const isMine =
                senderId != null &&
                currentUserId != null &&
                senderId.toString() === currentUserId.toString();

              const senderName =
                message.sender?.name ||
                (isMine ? currentUser?.name : "") ||
                "Workspace member";

              const previousMessage = messages[index - 1];

              const showSender =
                !isMine &&
                (!previousMessage ||
                  (
                    previousMessage.sender?._id ||
                    previousMessage.sender?.id ||
                    previousMessage.sender
                  )?.toString() !== senderId?.toString());

              return (
                <Stack
                  key={message._id}
                  direction={isMine ? "row-reverse" : "row"}
                  alignItems="flex-end"
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  {!isMine && (
                    <Avatar
                      src={message.sender?.avatar || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: "#DCC1A9",
                        color: COLORS.primaryDark,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(senderName)}
                    </Avatar>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMine ? "flex-end" : "flex-start",
                      maxWidth: { xs: "85%", sm: "75%" },
                      minWidth: 0,
                    }}
                  >
                    {showSender && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.muted,
                          fontWeight: 650,
                          mb: 0.5,
                          ml: 0.5,
                        }}
                      >
                        {senderName}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        px: 1.8,
                        py: 1.15,
                        borderRadius: isMine
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        bgcolor: isMine
                          ? COLORS.ownMessage
                          : COLORS.otherMessage,
                        color: isMine ? "#FFFFFF" : COLORS.text,
                        boxShadow: "0 2px 5px rgba(50, 30, 15, 0.035)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          lineHeight: 1.65,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{
                        mt: 0.6,
                        mx: 0.5,
                        color: COLORS.muted,
                      }}
                    >
                      <AccessTimeRoundedIcon sx={{ fontSize: 11 }} />

                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.67rem" }}
                      >
                        {formatTime(message.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              );
            })}

            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      {/* Inline error */}
      {error && messages.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            bgcolor: "#FFF0EF",
            color: "#B42318",
          }}
        >
          <Typography variant="caption">{error}</Typography>
        </Box>
      )}

      <Divider sx={{ borderColor: COLORS.border }} />

      {/* Message input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1.2,
          p: { xs: 1.5, sm: 2 },
          bgcolor: COLORS.surface,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write a message to your team..."
          size="small"
          inputProps={{ maxLength: 2000 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              bgcolor: "#FCFAF8",
              fontSize: "0.9rem",
              "& fieldset": {
                borderColor: COLORS.border,
              },
              "&:hover fieldset": {
                borderColor: "#C7A58A",
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.primary,
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!content.trim() || sending || !workspaceId || !token}
          endIcon={
            sending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendRoundedIcon />
            )
          }
          sx={{
            minWidth: { xs: 48, sm: 105 },
            height: 42,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            bgcolor: COLORS.primary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: COLORS.primaryDark,
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#D8C9BC",
              color: "#FFFFFF",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Send
          </Box>
        </Button>
      </Box>
    </Paper>
  );
}

export default WorkspaceChat;
