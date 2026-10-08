import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import WorkspaceMember from "./models/workspaceMember.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  // Socket Authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.id || decoded.userId;

      if (!socket.userId) {
        return next(new Error("Invalid authentication token"));
      }

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);

      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id}, User: ${socket.userId}`
    );

    // Join workspace
    socket.on("workspace:join", async (workspaceId) => {
      try {
        if (!workspaceId) {
          return socket.emit("workspace:error", {
            message: "Workspace ID is required",
          });
        }

        // Check workspace membership
        const membership = await WorkspaceMember.findOne({
          workspace: workspaceId,
          user: socket.userId,
        });

        if (!membership) {
          return socket.emit("workspace:error", {
            message: "You are not a member of this workspace",
          });
        }

        const room = `workspace:${workspaceId}`;

        socket.join(room);

        console.log(
          `User ${socket.userId} joined ${room}`
        );

        socket.emit("workspace:joined", {
          workspaceId,
          message: "Joined workspace successfully",
        });

        socket.to(room).emit("workspace:user-joined", {
          userId: socket.userId,
        });
      } catch (error) {
        console.error("Workspace join error:", error);

        socket.emit("workspace:error", {
          message: "Unable to join workspace",
        });
      }
    });

    // Leave workspace
    socket.on("workspace:leave", (workspaceId) => {
      if (!workspaceId) {
        return;
      }

      const room = `workspace:${workspaceId}`;

      socket.leave(room);

      console.log(
        `User ${socket.userId} left ${room}`
      );

      socket.to(room).emit("workspace:user-left", {
        userId: socket.userId,
      });
    });

    // Chat message
    socket.on(
      "chat:send",
      async ({ workspaceId, message }) => {
        try {
          if (!workspaceId || !message?.trim()) {
            return;
          }

          // Verify membership before sending
          const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: socket.userId,
          });

          if (!membership) {
            return socket.emit("chat:error", {
              message: "You are not a member of this workspace",
            });
          }

          io.to(`workspace:${workspaceId}`).emit(
            "chat:message",
            {
              userId: socket.userId,
              message: message.trim(),
              createdAt: new Date(),
            }
          );
        } catch (error) {
          console.error("Chat send error:", error);

          socket.emit("chat:error", {
            message: "Unable to send message",
          });
        }
      }
    );

    // Disconnect
    socket.on("disconnect", (reason) => {
      console.log(
        `Socket disconnected: ${socket.id}`,
        reason
      );
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