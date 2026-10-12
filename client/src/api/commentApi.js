import axiosInstance from "./axiosInstance";

// Get comments for a card
export const getComments = async (cardId) => {
  const response = await axiosInstance.get(
    `/comments/card/${cardId}`
  );

  return response.data;
};

// Create comment
export const createComment = async (cardId, text) => {
  const response = await axiosInstance.post(
    `/comments/card/${cardId}`,
    {
      text,
    }
  );

  return response.data;
};

// Update comment
export const updateComment = async (commentId, text) => {
  const response = await axiosInstance.put(
    `/comments/${commentId}`,
    {
      text,
    }
  );

  return response.data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const response = await axiosInstance.delete(
    `/comments/${commentId}`
  );

  return response.data;
};