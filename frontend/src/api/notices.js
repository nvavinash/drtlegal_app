import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/api/notices`;

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Public
export const getNotices = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

// Admin: create notice with optional PDF
export const createNotice = async (formData, token) => {
  const res = await axios.post(BASE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Admin: update notice
export const updateNotice = async (id, formData, token) => {
  const res = await axios.put(`${BASE}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Admin: delete notice
export const deleteNotice = async (id, token) => {
  const res = await axios.delete(`${BASE}/${id}`, authHeaders(token));
  return res.data;
};
