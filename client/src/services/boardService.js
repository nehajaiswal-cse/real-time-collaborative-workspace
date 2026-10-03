const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getBoards = async (workspaceId) => {
  const token = localStorage.getItem("token");
  if (!workspaceId) return [];

  const response = await fetch(`${API_URL}/boards/workspace/${workspaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch boards");
  }

  const data = await response.json();
  return data.boards || [];
};

export const createBoard = async (name, workspaceId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, workspaceId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create board");
  }

  const data = await response.json();
  return data.board;
};