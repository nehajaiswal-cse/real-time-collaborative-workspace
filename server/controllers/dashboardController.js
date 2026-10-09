
import Board from "../models/board.js";
import List from "../models/list.js";
import Card from "../models/card.js";
import WorkspaceMember from "../models/workspaceMember.js";

export const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verify that the user belongs to this workspace
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // Get all boards belonging to this workspace
    const boards = await Board.find({
      workspace: workspaceId,
    }).select("_id");

    const boardIds = boards.map((board) => board._id);

    // Get lists belonging to these boards
    const lists = await List.find({
      board: { $in: boardIds },
    }).select("_id");

    const listIds = lists.map((list) => list._id);

    // Count cards belonging to these lists
    const [totalCards, totalMembers] = await Promise.all([
      Card.countDocuments({
        list: { $in: listIds },
      }),
      WorkspaceMember.countDocuments({
        workspace: workspaceId,
      }),
    ]);

    return res.json({
      totalBoards: boards.length,
      totalCards,
      totalMembers,
    });
  } catch (error) {
    console.error("Get workspace stats error:", error);

    return res.status(500).json({
      message: "Unable to fetch workspace statistics",
    });
  }
};