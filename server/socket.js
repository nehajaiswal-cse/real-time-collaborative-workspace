import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join workspace room
    socket.on("workspace:join", (workspaceId) => {
      if (!workspaceId) {
        return;
      }

      socket.join(`workspace:${workspaceId}`);

      console.log(
        `Socket ${socket.id} joined workspace:${workspaceId}`
      );
    });

    // Leave workspace room
    socket.on("workspace:leave", (workspaceId) => {
      if (!workspaceId) {
        return;
      }

      socket.leave(`workspace:${workspaceId}`);

      console.log(
        `Socket ${socket.id} left workspace:${workspaceId}`
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Get Socket.io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};