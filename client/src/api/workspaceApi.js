
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  };
};

export const getMyWorkspaces = async () => {
  const response = await axios.get(
    `${API_URL}/workspaces`,
    getAuthConfig()
  );

  return (
    response.data.workspaces ||
    response.data.data ||
    []
  );
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