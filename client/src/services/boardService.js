const API_URL = "http://localhost:5000/api";

export const getBoards = async () => {
  const response = await fetch(`${API_URL}/boards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch boards");
  }

  return response.json();
};