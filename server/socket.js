import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
  cors: {
    origin: [
      "https://real-time-collaborative-workspace-qmc2.onrender.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
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

      console.log(`Socket ${socket.id} joined workspace:${workspaceId}`);
    });

    // Leave workspace room
    socket.on("workspace:leave", (workspaceId) => {
      if (!workspaceId) {
        return;
      }

      socket.leave(`workspace:${workspaceId}`);

      console.log(`Socket ${socket.id} left workspace:${workspaceId}`);
    });

  
    // BOARD ROOM

    socket.on("board:join", (boardId) => {
      if (!boardId) return;

      socket.join(`board:${boardId}`);

      console.log(
        `Socket ${socket.id} joined board:${boardId}`
      );
    });

    socket.on("board:leave", (boardId) => {
      if (!boardId) return;

      socket.leave(`board:${boardId}`);

      console.log(
        `Socket ${socket.id} left board:${boardId}`
      );
    });

    // Real-time chat message
    socket.on("chat:send", ({ workspaceId, message }) => {
      if (!workspaceId || !message) {
        return;
      }

      io.to(`workspace:${workspaceId}`).emit("chat:message", message);
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
