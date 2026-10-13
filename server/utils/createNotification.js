import Notification from "../models/notification.js";
import { getIO } from "../socket.js";

const createNotification = async ({
  recipient,
  sender = null,
  workspace,
  type,
  message,
  entityId = null,
  entityType = null,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    workspace,
    type,
    message,
    entityId,
    entityType,
  });

  const populatedNotification = await Notification.findById(
    notification._id
  )
    .populate("sender", "name email")
    .populate("workspace", "name");

  // Deliver immediately if the recipient is connected.
  getIO().to(`user:${recipient}`).emit(
    "notification:new",
    populatedNotification
  );

  return populatedNotification;
};

export default createNotification;