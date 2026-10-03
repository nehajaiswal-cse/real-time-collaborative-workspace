import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, getAuthConfig());
    return response.data?.data || response.data || { activities: [] };
  } catch (error) {
    // Backend doesn't have an explicit /dashboard endpoint, fall back cleanly
    return { activities: [] };
  }
};

export const getBoards = async (workspaceId) => {
  if (!workspaceId) return [];
  const response = await axios.get(
    `${API_URL}/boards/workspace/${workspaceId}`,
    getAuthConfig()
  );

  return response.data.boards || response.data.data || [];
};

export const createBoardApi = async (boardData) => {
  const response = await axios.post(
    `${API_URL}/boards`,
    boardData,
    getAuthConfig()
  );

  return response.data.board;
};