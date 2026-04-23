const BASE_URL = "http://localhost:5000/api/commissioners";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * GET /api/commissioners
 * Returns all COP members with experience & queue assignment status.
 */
export const getCommissionerList = async (token) => {
  const { default: axios } = await import("axios");
  const res = await axios.get(BASE_URL, authHeaders(token));
  return res.data;
};

/**
 * GET /api/commissioners/next
 * Assigns & returns the next commissioner in line.
 * Admin + Editor only.
 */
export const getNextCommissioner = async (token) => {
  const { default: axios } = await import("axios");
  const res = await axios.get(`${BASE_URL}/next`, authHeaders(token));
  return res.data;
};

/**
 * POST /api/commissioners/init
 * Initializes/resets the commissioner queue (Admin only).
 */
export const initCommissionerQueue = async (token) => {
  const { default: axios } = await import("axios");
  const res = await axios.post(`${BASE_URL}/init`, {}, authHeaders(token));
  return res.data;
};
