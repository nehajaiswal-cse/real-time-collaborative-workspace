import Workspace from "../models/workspace.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required"
      });
    }

    const workspace = await Workspace.create({
      name,

      owner: req.user.id,

      members: [
        {
          user: req.user.id,
          role: "owner"
        }
      ]
    });

    const populatedWorkspace = await Workspace.findById(
      workspace._id
    )
      .populate("owner", "name email")
      .populate("members.user", "name email");

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
    const workspaces = await Workspace.find({
      "members.user": req.user.id
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

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
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      "members.user": req.user.id
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

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