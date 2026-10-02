import List from "../models/list.js";
import Board from "../models/board.js";
import WorkspaceMember from "../models/workspaceMember.js";

// Create List
export const createList = async (req, res) => {
  try {
    const { name, boardId, position } = req.body;

    if (!name || !boardId) {
      return res.status(400).json({
        message: "List name and board are required"
      });
    }

    // Find board
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const list = await List.create({
      name: name.trim(),
      board: boardId,
      position: position ?? 0
    });

    const populatedList = await List.findById(list._id)
      .populate("board", "name");

    res.status(201).json({
      message: "List created successfully",
      list: populatedList
    });
  } catch (error) {
    console.error("Create list error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get all lists of a board
export const getBoardLists = async (req, res) => {
  try {
    const { boardId } = req.params;

    // Find board
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const lists = await List.find({
      board: boardId
    }).sort({ position: 1, createdAt: 1 });

    res.json({
      lists
    });
  } catch (error) {
    console.error("Get board lists error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get single list
export const getListById = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await List.findById(id)
      .populate("board", "name workspace");

    if (!list) {
      return res.status(404).json({
        message: "List not found"
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: list.board.workspace,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    res.json({
      list
    });
  } catch (error) {
    console.error("Get list error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update List
export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        message: "List not found"
      });
    }

    // Find board
    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "List name cannot be empty"
        });
      }

      list.name = name.trim();
    }

    if (position !== undefined) {
      list.position = position;
    }

    await list.save();

    const updatedList = await List.findById(list._id)
      .populate("board", "name");

    res.json({
      message: "List updated successfully",
      list: updatedList
    });
  } catch (error) {
    console.error("Update list error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete List
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({
        message: "List not found"
      });
    }

    // Find board
    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    await List.findByIdAndDelete(id);

    res.json({
      message: "List deleted successfully"
    });
  } catch (error) {
    console.error("Delete list error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};