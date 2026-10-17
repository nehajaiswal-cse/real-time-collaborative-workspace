
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

// userId -> Set of socket IDs
const onlineUsers = new Map();

const getUserIdFromSocket = (socket) => {
  // Prefer a JWT supplied through the Socket.IO handshake.
  let token = socket.handshake.auth?.token;

  // Otherwise, read the JWT from the HTTP-only cookie.
  if (!token) {
    const cookies = socket.handshake.headers.cookie || "";

    const tokenCookie = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      token = decodeURIComponent(tokenCookie.substring(6));
    }
  }

  if (!token) {
    throw new Error("Authentication required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded.id) {
    throw new Error("Invalid authentication token");
  }

  return decoded.id.toString();
};

const addOnlineUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId).add(socketId);
};

const removeOnlineUser = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);

  if (!sockets) return false;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true; // No active sockets remain for this user.
  }

  return false;
};

const getWorkspaceOnlineUsers = (workspaceId) => {
  const room = io.sockets.adapter.rooms.get(
    `workspace:${workspaceId}`
  );

  if (!room) return [];

  const userIds = new Set();

  for (const socketId of room) {
    const connectedSocket = io.sockets.sockets.get(socketId);

    if (connectedSocket?.data.userId) {
      userIds.add(connectedSocket.data.userId);
    }
  }

  return [...userIds];
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  // Authenticate every socket before allowing it to connect.
  io.use((socket, next) => {
    try {
      const userId = getUserIdFromSocket(socket);
      socket.data.userId = userId;
      next();
    } catch (error) {
       console.error("Socket auth error:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    addOnlineUser(userId, socket.id);

    console.log(`Socket connected: ${socket.id}, user: ${userId}`);

    // WORKSPACE ROOM + PRESENCE
    socket.on("workspace:join", (workspaceId) => {
      console.log("workspace:join received:", workspaceId);
      if (!workspaceId) {
    console.log("Workspace ID missing");
    return;
  }
      const room = `workspace:${workspaceId}`;
      console.log(room)
      socket.join(room);
     
       console.log("Workspace joined:", room);
       console.log("Online users:", getWorkspaceOnlineUsers(workspaceId));
      // Send a snapshot of online users in this workspace.
      socket.emit(
        "presence:sync",
        getWorkspaceOnlineUsers(workspaceId)
      );

      // Notify other workspace clients of this user's presence.
      socket.to(room).emit("user:online", { userId });

      console.log(`Socket ${socket.id} joined ${room}`);
    });

    socket.on("workspace:leave", (workspaceId) => {
      if (!workspaceId) return;

      const room = `workspace:${workspaceId}`;

      // Only announce offline if this was the user's last
      // socket connected to this particular workspace.
      const otherSocketsInWorkspace = [
        ...(io.sockets.adapter.rooms.get(room) || []),
      ].some((socketId) => {
        if (socketId === socket.id) return false;

        return (
          io.sockets.sockets.get(socketId)?.data.userId === userId
        );
      });

      socket.leave(room);

      if (!otherSocketsInWorkspace) {
        io.to(room).emit("user:offline", { userId });
      }

      console.log(`Socket ${socket.id} left ${room}`);
    });

    // BOARD ROOM
    socket.on("board:join", (boardId) => {
      if (!boardId) return;

      socket.join(`board:${boardId}`);
      console.log(`Socket ${socket.id} joined board:${boardId}`);
    });

    socket.on("board:leave", (boardId) => {
      if (!boardId) return;

      socket.leave(`board:${boardId}`);
      console.log(`Socket ${socket.id} left board:${boardId}`);
    });

    // REAL-TIME CHAT
    socket.on("chat:send", ({ workspaceId, message } = {}) => {
      if (!workspaceId || !message) return;

      // Verify the sender is actually in this workspace.
      if (!socket.rooms.has(`workspace:${workspaceId}`)) return;

      io.to(`workspace:${workspaceId}`).emit(
        "chat:message",
        message
      );
    });

    // Capture workspace rooms before Socket.IO removes them.
    let joinedWorkspaces = [];

    socket.on("disconnecting", () => {
      joinedWorkspaces = [...socket.rooms]
        .filter((room) => room.startsWith("workspace:"))
        .map((room) => room.slice("workspace:".length));
    });

    socket.on("disconnect", () => {
      removeOnlineUser(userId, socket.id);

      // Check each workspace independently. A user may have
      // other tabs connected to some workspaces but not others.
      for (const workspaceId of joinedWorkspaces) {
        const room = `workspace:${workspaceId}`;

        const stillPresent = [
          ...(io.sockets.adapter.rooms.get(room) || []),
        ].some((socketId) => {
          return (
            io.sockets.sockets.get(socketId)?.data.userId === userId
          );
        });

        if (!stillPresent) {
          io.to(room).emit("user:offline", { userId });
        }
      }

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized"
    );
  }

  return io;
};