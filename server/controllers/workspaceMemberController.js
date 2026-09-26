import WorkspaceMember from "../models/workspaceMember.js";
import Workspace from "../models/workspace.js";
import User from "../models/user.js";

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { workspaceId, userId, role } = req.body;

    if (!workspaceId || !userId) {
      return res.status(400).json({
        message: "Workspace and user are required"
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Only workspace owner can add members
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can add members"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existingMember = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: userId
    });

    if (existingMember) {
      return res.status(409).json({
        message: "User is already a member of this workspace"
      });
    }

    const member = await WorkspaceMember.create({
      workspace: workspaceId,
      user: userId,
      role: role || "member"
    });

    const populatedMember = await WorkspaceMember.findById(member._id)
      .populate("user", "name email")
      .populate("workspace", "name");

    res.status(201).json({
      message: "Member added successfully",
      member: populatedMember
    });
  } catch (error) {
    console.error("Add member error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Get workspace members
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const members = await WorkspaceMember.find({
      workspace: workspaceId
    })
      .populate("user", "name email avatar")
      .sort({ createdAt: 1 });

    res.json({
      members
    });
  } catch (error) {
    console.error("Get members error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Update member role
export const updateMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        message: "Role must be admin or member"
      });
    }

    const member = await WorkspaceMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    const workspace = await Workspace.findById(member.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Only owner can change roles
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can change member roles"
      });
    }

    // Owner role cannot be changed
    if (member.role === "owner") {
      return res.status(400).json({
        message: "Owner role cannot be changed"
      });
    }

    member.role = role;

    await member.save();

    const updatedMember = await WorkspaceMember.findById(member._id)
      .populate("user", "name email avatar");

    res.json({
      message: "Member role updated successfully",
      member: updatedMember
    });
  } catch (error) {
    console.error("Update member role error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Remove member
export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await WorkspaceMember.findById(id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    const workspace = await Workspace.findById(member.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Only owner can remove members
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only workspace owner can remove members"
      });
    }

    // Owner cannot be removed
    if (member.role === "owner") {
      return res.status(400).json({
        message: "Workspace owner cannot be removed"
      });
    }

    await WorkspaceMember.findByIdAndDelete(id);

    res.json({
      message: "Member removed successfully"
    });
  } catch (error) {
    console.error("Remove member error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};