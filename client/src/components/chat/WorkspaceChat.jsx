import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";

const API_URL = "http://localhost:5000/api/messages";

function WorkspaceChat({ workspaceId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch existing messages
  useEffect(() => {
    if (!workspaceId || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/workspace/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [workspaceId, token]);

  // Join workspace + listen for real-time messages
  useEffect(() => {
    if (!workspaceId) return;

    socket.emit("workspace:join", workspaceId);

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (item) => item._id === message._id
        );

        if (alreadyExists) return prev;

        return [...prev, message];
      });
    };

    socket.on("chat:message", handleNewMessage);

    return () => {
      socket.off("chat:message", handleNewMessage);
      socket.emit("workspace:leave", workspaceId);
    };
  }, [workspaceId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!content.trim() || !workspaceId || !token) return;

    try {
      const response = await axios.post(
        `${API_URL}/workspace/${workspaceId}`,
        {
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMessage = response.data.message;

      // Show immediately for sender
      setMessages((prev) => [...prev, newMessage]);

      // Send to other workspace members
      socket.emit("chat:send", {
        workspaceId,
        message: newMessage,
      });

      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "500px",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #ddd",
          fontWeight: "600",
          fontSize: "18px",
        }}
      >
        Workspace Chat
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: "#777" }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message) => {
            const senderId =
              message.sender?._id || message.sender?.id;

            const isMine =
              senderId?.toString() === currentUser?.id?.toString();

            return (
              <div
                key={message._id}
                style={{
                  marginBottom: "12px",
                  textAlign: isMine ? "right" : "left",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    marginBottom: "3px",
                  }}
                >
                  {message.sender?.name || "Unknown User"}
                </div>

                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isMine ? "#b27a50" : "#f1f1f1",
                    color: isMine ? "#fff" : "#222",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  {message.content}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          gap: "8px",
          padding: "12px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          disabled={!content.trim()}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            background: "#b27a50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default WorkspaceChat;