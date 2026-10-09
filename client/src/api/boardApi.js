
import axiosInstance from "./axiosInstance";

export const getWorkspaceBoards = async (workspaceId) => {
  const response = await axiosInstance.get(
    `/boards/workspace/${workspaceId}`
  );

  return response.data;
};

export const getBoardById = async (boardId) => {
  const response = await axiosInstance.get(`/boards/${boardId}`);

  return response.data.board || response.data.data || [];
};

export const createBoard = async (name,workspaceId) => {
  const response = await axiosInstance.post("/boards", {name: name.trim(),workspaceId});

  return response.data;
};

export const updateBoard = async (boardId, boardData) => {
  const response = await axiosInstance.put(
    `/boards/${boardId}`,
    boardData
  );
  console.log(response)

  return response.data.board;
};

export const deleteBoard = async (boardId) => {
  const response = await axiosInstance.delete(`/boards/${boardId}`);

  return response.data;
};


export const getWorkspaceStats = async (workspaceId) => {
  const response = await axiosInstance.get(
    `/boards/workspace/${workspaceId}/stats`
  );

  return response.data;
};