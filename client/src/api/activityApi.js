
import axiosInstance from "./axiosInstance";

export const getActivities = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const response = await axiosInstance.get("/activities", {
    params: { workspaceId },
  });

  const result = response.data?.data ?? response.data;

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.activities)) {
    return result.activities;
  }

  return [];
};



