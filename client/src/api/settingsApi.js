
import axios from "axios";
import { getMyWorkspaces } from "./workspaceApi.js";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

export const getCurrentUser = async () => {
  const response = await axios.get(
    `${API_URL}/auth/me`,
    getAuthConfig()
  );

  return response.data?.user ?? response.data?.data?.user ?? null;
};

export { getMyWorkspaces };