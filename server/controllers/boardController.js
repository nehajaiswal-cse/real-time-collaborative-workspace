import Board from "../models/board.js";
import Workspace from "../models/workspace.js";

// Create Board
export const createBoard = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({
        message: "Board name and workspace are required"
      });
    }

    // Check whether user is a member of the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user.id
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const board = await Board.create({
      name,
      workspace: workspaceId,
      createdBy: req.user.id
    });

    const populatedBoard = await Board.findById(board._id)
      .populate("workspace", "name")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Board created successfully",
      board: populatedBoard
    });
  } catch (error) {
    console.error("Create board error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get all boards of a workspace
export const getWorkspaceBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check workspace membership
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user.id
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const boards = await Board.find({
      workspace: workspaceId
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      boards
    });
  } catch (error) {
    console.error("Get workspace boards error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get single board
export const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id)
      .populate("workspace", "name")
      .populate("createdBy", "name email");

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check whether user belongs to board's workspace
    const workspace = await Workspace.findOne({
      _id: board.workspace._id,
      "members.user": req.user.id
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    res.json({
      board
    });
  } catch (error) {
    console.error("Get board error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Board
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Board name is required"
      });
    }

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const workspace = await Workspace.findOne({
      _id: board.workspace,
      "members.user": req.user.id
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    board.name = name.trim();

    await board.save();

    const updatedBoard = await Board.findById(board._id)
      .populate("workspace", "name")
      .populate("createdBy", "name email");

    res.json({
      message: "Board updated successfully",
      board: updatedBoard
    });
  } catch (error) {
    console.error("Update board error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Board
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const workspace = await Workspace.findOne({
      _id: board.workspace,
      "members.user": req.user.id
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    await Board.findByIdAndDelete(id);

    res.json({
      message: "Board deleted successfully"
    });
  } catch (error) {
    console.error("Delete board error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};