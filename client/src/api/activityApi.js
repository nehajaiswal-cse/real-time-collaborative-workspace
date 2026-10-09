
import axios from "axios";

const API_URL = "http://localhost:5000/api/activities";

export const getActivities = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const response = await axios.get(API_URL, {
    params: {
      workspaceId,
    },
    withCredentials: true,
  });

  return response.data.activities || response.data || [];
};

