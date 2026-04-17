import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEvent = async (eventData, token) => {
  const response = await axios.post(API_URL, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateEvent = async (id, eventData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteEvent = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
