import Document from "../models/document.js";
import WorkspaceMember from "../models/workspaceMember.js";
import { getIO } from "../socket.js";

// Get all documents of a workspace
export const getWorkspaceDocuments = async (req, res) => {
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

    const documents = await Document.find({
      workspace: workspaceId,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ updatedAt: -1 });

    res.json({ documents });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create document
export const createDocument = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Document title is required",
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

    const document = await Document.create({
      workspace: workspaceId,
      title: title.trim(),
      content: content || "",
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    const populatedDocument = await Document.findById(document._id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.status(201).json({
      document: populatedDocument,
    });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { title, content } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: document.workspace,
      user: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    if (title !== undefined) {
      document.title = title.trim();
    }

    if (content !== undefined) {
      document.content = content;
    }

    document.updatedBy = req.user.id;

    await document.save();

    const updatedDocument = await Document.findById(document._id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    const io = getIO();

    io.to(`workspace:${document.workspace}`).emit(
      "document:updated",
      updatedDocument,
    );
    res.json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
