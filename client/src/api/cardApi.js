import axiosInstance from "./axiosInstance";

export const getCardsByList = async (listId) => {
  const response = await axiosInstance.get(`/cards/list/${listId}`);

  return response.data;
};

export const createCard = async (cardData) => {
  const response = await axiosInstance.post("/cards", cardData);

  return response.data;
};

export const updateCard = async (cardId, cardData) => {
  const response = await axiosInstance.put(`/cards/${cardId}`, cardData);

  return response.data;
};

export const deleteCard = async (cardId) => {
  const response = await axiosInstance.delete(`/cards/${cardId}`);

  return response.data;
};

export const moveCard = async (cardId, moveData) => {
  const response = await axiosInstance.put(
    `/cards/${cardId}/move`,
    moveData
  );

  return response.data;
};