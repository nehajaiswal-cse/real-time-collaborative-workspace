import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member"
    }
  },
  {
    _id: false
  }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [workspaceMemberSchema]
  },
  {
    timestamps: true
  }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;