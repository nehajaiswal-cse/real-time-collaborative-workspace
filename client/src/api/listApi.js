import axiosInstance from "./axiosInstance";

export const getListsByBoard = async (boardId) => {
  const response = await axiosInstance.get(`/lists/board/${boardId}`);

  return response.data;
};

export const createList = async (listData) => {
  const response = await axiosInstance.post("/lists", listData);

  return response.data;
};