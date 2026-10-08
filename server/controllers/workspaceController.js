import Workspace from "../models/workspace.js";
import WorkspaceMember from "../models/workspaceMember.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required"
      });
    }

    // Create workspace
    const workspace = await Workspace.create({
      name,
      owner: req.user.id
    });

    // Add creator as workspace owner
    await WorkspaceMember.create({
      workspace: workspace._id,
      user: req.user.id,
      role: "owner"
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email");

    res.status(201).json({
      message: "Workspace created successfully",
      workspace: populatedWorkspace
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


export const getMyWorkspaces = async (req, res) => {
  try {
    const memberships = await WorkspaceMember.find({
      user: req.user.id
    })
      .populate({
        path: "workspace",
        populate: {
          path: "owner",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    const workspaces = memberships.map(
      (membership) => membership.workspace
    );

    res.json({
      workspaces
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


export const getWorkspaceById = async (req, res) => {
  try {
    // Check membership
    const membership = await WorkspaceMember.findOne({
      workspace: req.params.id,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    res.json({
      workspace
    });
  } catch (error) {
    console.error("Get workspace error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Check membership
    const membership = await WorkspaceMember.findOne({
      workspace: workspace._id,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    // Only owner/admin can update workspace
    if (
      membership.role !== "owner" &&
      membership.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You do not have permission to update this workspace"
      });
    }

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          message: "Workspace name must be at least 2 characters"
        });
      }

      workspace.name = name.trim();
    }

    if (description !== undefined) {
      workspace.description = description.trim();
    }

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email");

    res.json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace
    });
  } catch (error) {
    console.error("Update workspace error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};