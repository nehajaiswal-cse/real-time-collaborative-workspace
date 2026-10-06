import Card from "../models/card.js";
import List from "../models/list.js";
import Board from "../models/board.js";
import WorkspaceMember from "../models/workspaceMember.js";
import User from "../models/user.js";
import { getIO } from "../socket.js";
import createActivity from "../utils/createActivity.js";

// Create Card
export const createCard = async (req, res) => {
  try {
    const {
      title,
      description,
      listId,
      assignedTo,
      priority,
      position,
      dueDate,
    } = req.body;

    if (!title || !listId) {
      return res.status(400).json({
        message: "Card title and list are required",
      });
    }

    // Check list
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    // Check board
    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // If assignedTo is provided, check user exists
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const card = await Card.create({
      title: title.trim(),
      description: description?.trim() || "",
      list: listId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      priority: priority || "medium",
      position: position ?? 0,
      dueDate: dueDate || null,
    });

    const populatedCard = await Card.findById(card._id)
      .populate("list", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    const io = getIO();

    io.to(`workspace:${board.workspace}`).emit("card:created", populatedCard);

    await createActivity({
  type: "CARD_CREATED",
  userId: req.user.id,
  workspaceId: workspaceId,
  boardId: boardId,
  cardId: card._id,
  message: `created card "${card.title}"`,
});

    res.status(201).json({
      message: "Card created successfully",
      card: populatedCard,
    });
  } catch (error) {
    console.error("Create card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all cards of a list
export const getListCards = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const cards = await Card.find({
      list: listId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ position: 1, createdAt: 1 });

    res.json({
      cards,
    });
  } catch (error) {
    console.error("Get list cards error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get single card
export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id)
      .populate("list", "name board")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const board = await Board.findById(card.list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    res.json({
      card,
    });
  } catch (error) {
    console.error("Get card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Card
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, assignedTo, priority, position, dueDate } =
      req.body;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const list = await List.findById(card.list);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Card title cannot be empty",
        });
      }

      card.title = title.trim();
    }

    if (description !== undefined) {
      card.description = description.trim();
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        card.assignedTo = null;
      } else {
        const assignedUser = await User.findById(assignedTo);

        if (!assignedUser) {
          return res.status(404).json({
            message: "Assigned user not found",
          });
        }

        card.assignedTo = assignedTo;
      }
    }

    if (priority !== undefined) {
      if (!["low", "medium", "high"].includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      card.priority = priority;
    }

    if (position !== undefined) {
      card.position = position;
    }

    if (dueDate !== undefined) {
      card.dueDate = dueDate;
    }

    await card.save();

    const updatedCard = await Card.findById(card._id)
      .populate("list", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    const io = getIO();

    io.to(`workspace:${board.workspace}`).emit("card:updated", updatedCard);

    await createActivity({
  type: "CARD_UPDATED",
  userId: req.user.id,
  workspaceId,
  boardId,
  cardId: card._id,
  message: `updated card "${card.title}"`,
});

    res.json({
      message: "Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Update card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Card
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const list = await List.findById(card.list);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const board = await Board.findById(list.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    await Card.findByIdAndDelete(id);

    const io = getIO();

    io.to(`workspace:${board.workspace}`).emit("card:deleted", id);

    res.json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error("Delete card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Move Card to another List
export const moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    if (!listId) {
      return res.status(400).json({
        message: "New list is required",
      });
    }

    // Find card
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    // Find old list
    const oldList = await List.findById(card.list);

    if (!oldList) {
      return res.status(404).json({
        message: "Current list not found",
      });
    }

    // Find board
    const board = await Board.findById(oldList.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // Check workspace membership
    const membership = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Find new list
    const newList = await List.findById(listId);

    if (!newList) {
      return res.status(404).json({
        message: "New list not found",
      });
    }

    // Make sure new list belongs to the same board
    if (newList.board.toString() !== board._id.toString()) {
      return res.status(400).json({
        message: "Card can only be moved within the same board",
      });
    }

    // Update card
    card.list = newList._id;

    if (position !== undefined) {
      card.position = position;
    }

    await card.save();

    // Populate updated card
    const movedCard = await Card.findById(card._id)
      .populate("list", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // Emit real-time event
    const io = getIO();

    io.to(`workspace:${board.workspace}`).emit(
      "card:moved",
      movedCard
    );

    await createActivity({
  type: "CARD_MOVED",
  userId: req.user.id,
  workspaceId,
  boardId,
  cardId: card._id,
  message: `moved card "${card.title}"`,
});
    res.json({
      message: "Card moved successfully",
      card: movedCard,
    });
  } catch (error) {
    console.error("Move card error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
