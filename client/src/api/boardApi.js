// src/api/boardApi.js

import axiosInstance from "./axiosInstance";

export const getWorkspaceBoards = async (workspaceId) => {
  const response = await axiosInstance.get(
    `/boards/workspace/${workspaceId}`
  );

  return response.data;
};

export const getBoardById = async (boardId) => {
  const response = await axiosInstance.get(`/boards/${boardId}`);

  return response.data;
};

export const createBoard = async (boardData) => {
  const response = await axiosInstance.post("/boards", boardData);

  return response.data;
};

export const updateBoard = async (boardId, boardData) => {
  const response = await axiosInstance.put(
    `/boards/${boardId}`,
    boardData
  );

  return response.data;
};

export const deleteBoard = async (boardId) => {
  const response = await axiosInstance.delete(`/boards/${boardId}`);

  return response.data;
};