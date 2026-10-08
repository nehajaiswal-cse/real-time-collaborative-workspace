import User from "../models/user.js";
import bcrypt from "bcryptjs";

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message: "Nothing to update"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          message: "Name must be at least 2 characters"
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already in use"
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET PREFERENCES
export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("preferences");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      preferences: user.preferences
    });
  } catch (error) {
    console.error("Get preferences error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// UPDATE PREFERENCES
export const updatePreferences = async (req, res) => {
  try {
    const {
      emailNotifications,
      workspaceNotifications
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications = Boolean(emailNotifications);
    }

    if (workspaceNotifications !== undefined) {
      user.preferences.workspaceNotifications =
        Boolean(workspaceNotifications);
    }

    await user.save();

    res.json({
      message: "Preferences updated successfully",
      preferences: user.preferences
    });
  } catch (error) {
    console.error("Update preferences error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    const user = await User.findById(req.user.id)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};