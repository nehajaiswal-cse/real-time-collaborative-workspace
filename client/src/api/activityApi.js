
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getActivities = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your activities.");
  }

  const response = await axios.get(`${API_URL}/activity`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = response.data?.data ?? response.data;

  // Supports both { data: { activities: [...] } }
  // and { data: [...] } response formats.
  const activities = Array.isArray(result)
    ? result
    : result?.activities;

  if (!Array.isArray(activities)) {
    throw new Error("Invalid activity API response.");
  }

  return activities;
};