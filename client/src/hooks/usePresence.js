import { useEffect, useState } from "react";
import socket from "../socket";

export default function usePresence(workspaceId) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!workspaceId) {
      setOnlineUsers([]);
      return;
    }

    const id = String(workspaceId);

    const handleSync = (userIds = []) => {
      setOnlineUsers(userIds.map(String));
    };

    const handleOnline = ({ userId } = {}) => {
      if (!userId) return;

      const id = String(userId);

      setOnlineUsers((previous) =>
        previous.includes(id) ? previous : [...previous, id]
      );
    };

    const handleOffline = ({ userId } = {}) => {
      if (!userId) return;

      const id = String(userId);

      setOnlineUsers((previous) =>
        previous.filter((existingId) => existingId !== id)
      );
    };

    const joinWorkspace = () => {
      console.log("Joining presence workspace:", id);
      socket.emit("workspace:join", id);
    };

    // Register listeners before connecting or joining.
    socket.on("presence:sync", handleSync);
    socket.on("user:online", handleOnline);
    socket.on("user:offline", handleOffline);
    socket.on("connect", joinWorkspace);

    if (socket.connected) {
      joinWorkspace();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("presence:sync", handleSync);
      socket.off("user:online", handleOnline);
      socket.off("user:offline", handleOffline);
      socket.off("connect", joinWorkspace);

      if (socket.connected) {
        socket.emit("workspace:leave", id);
      }
    };
  }, [workspaceId]);

  return onlineUsers;
}