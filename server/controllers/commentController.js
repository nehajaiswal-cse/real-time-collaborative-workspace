import Comment from "../models/comment.js";
import Card from "../models/card.js";
import List from "../models/list.js";
import Board from "../models/board.js";
import WorkspaceMember from "../models/workspaceMember.js";
import createActivity from "../utils/createActivity.js";


// GET COMMENTS FOR CARD
export const getCardComments = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);

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

    const member = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const comments = await Comment.find({
      card: cardId,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};


// CREATE COMMENT
export const createComment = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const card = await Card.findById(cardId);

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

    const member = await WorkspaceMember.findOne({
      workspace: board.workspace,
      user: req.user.id,
    });

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const comment = await Comment.create({
      card: cardId,
      user: req.user.id,
      text: text.trim(),
    });

    const populatedComment = await comment.populate(
      "user",
      "name email"
    );

    // Activity
    await createActivity({
      workspaceId: board.workspace,
      userId: req.user.id,
      action: "comment_created",
      entityType: "card",
      entityId: card._id,
      metadata: {
        commentId: comment._id,
        text: comment.text,
        cardTitle: card.title,
      },
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};


// UPDATE COMMENT
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own comments",
      });
    }

    comment.text = text.trim();

    await comment.save();

    const updatedComment = await comment.populate(
      "user",
      "name email"
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Update comment error:", error);

    res.status(500).json({
      message: "Failed to update comment",
    });
  }
};


// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};