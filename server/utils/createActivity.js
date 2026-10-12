import Activity from "../models/Activity.js";

const createActivity = async ({
  type,
  userId,
  workspaceId,
  boardId = null,
  cardId = null,
  message,
}) => {
  try {
    const activity = await Activity.create({
      type,
      user: userId,
      workspace: workspaceId,
      board: boardId,
      card: cardId,
      message,
    });

    return activity;
  } catch (error) {
    console.error("Create activity error:", error.message);

    // Activity failure should not break the main operation
    return null;
  }
};

export default createActivity;