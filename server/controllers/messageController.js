import Message from "../models/message.js";
import WorkspaceMember from "../models/workspaceMember.js";

// Get workspace messages
export const getWorkspaceMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const messages = await Message.find({
      workspace: workspaceId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a workspace message
export const createMessage = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const message = await Message.create({
      workspace: workspaceId,
      sender: req.user.id,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    res.status(201).json({
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};