import Activity from "../models/Activity.js";

export const getRecentActivities = async (req, res) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    const activities = await Activity.find({
      workspace: workspaceId,
    })
      .populate("user", "name avatar")
      .populate("board", "name")
      .populate("card", "title")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Get recent activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};
