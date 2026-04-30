import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/api/ledger`;

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Get all transactions
export const getTransactions = async (token) => {
  const res = await axios.get(BASE, authHeaders(token));
  return res.data;
};

// Get financial summary
export const getSummary = async (token) => {
  const res = await axios.get(`${BASE}/summary`, authHeaders(token));
  return res.data;
};

// Add a manual transaction
export const addTransaction = async (data, token) => {
  const res = await axios.post(BASE, data, authHeaders(token));
  return res.data;
};

// Delete a transaction
export const deleteTransaction = async (id, token) => {
  const res = await axios.delete(`${BASE}/${id}`, authHeaders(token));
  return res.data;
};
