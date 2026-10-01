
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch workspaces from the backend
export const getBoards = async () => {
  const response = await axios.get(
    `${API_URL}/workspaces`,
    getAuthConfig()
  );

  return response.data.workspaces || [];
};

// Create a workspace through the backend
export const createBoard = async (name) => {
  const response = await axios.post(
    `${API_URL}/workspaces`,
    { name },
    getAuthConfig()
  );

  return response.data.workspace;
};