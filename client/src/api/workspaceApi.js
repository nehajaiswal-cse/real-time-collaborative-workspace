
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
};

export const getMyWorkspaces = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/workspaces`,
      getAuthConfig()
    );

    const workspaces =
      response.data.workspaces ??
      response.data.data ??
      [];

    if (!Array.isArray(workspaces)) {
      throw new Error("Invalid workspace API response");
    }

    return workspaces;
  } catch (error) {
    console.error(
      "Workspace API error:",
      error.response?.status,
      error.response?.data || error.message
    );

    throw error;
  }
};

export const addWorkspaceMember = async (
  workspaceId,
  memberData
) => {
  const response = await axios.post(
    `${API_URL}/workspaces/${workspaceId}/members`,
    memberData,
    getAuthConfig()
  );

  return response.data;
};