import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data.data;
};

export const getBoards = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/boards",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data.data;
};