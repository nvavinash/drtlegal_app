import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/api/commissioner`;

const authH = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ── Public ──────────────────────────────────────────────────────────────────
/** GET /api/commissioner/list — all assignments (public) */
export const getAssignmentList = () => axios.get(`${BASE}/list`).then((r) => r.data);

/** GET /api/commissioner/cop-members — all COP members with assignment status (public) */
export const getCopMembersPublic = () => axios.get(`${BASE}/cop-members`).then((r) => r.data);

/** GET /api/commissioner/member-assignments — memberId -> latest active assignment */
export const getMemberAssignments = () =>
  axios.get(`${BASE}/member-assignments`).then((r) => r.data);

// ── Editor / Admin ───────────────────────────────────────────────────────────
/** GET /api/commissioner/next — preview next member + queue */
export const getNext = (token) => axios.get(`${BASE}/next`, authH(token)).then((r) => r.data);

/** GET /api/commissioner/history — last 20 assignments */
export const getHistory = (token) =>
  axios.get(`${BASE}/history`, authH(token)).then((r) => r.data);

/** GET /api/commissioner/eligible — full eligible list with pointer */
export const getEligibleList = (token) =>
  axios.get(`${BASE}/eligible`, authH(token)).then((r) => r.data);

/** POST /api/commissioner/assign */
export const assignCommissioner = (token, body) =>
  axios.post(`${BASE}/assign`, body, authH(token)).then((r) => r.data);

// ── Admin only ───────────────────────────────────────────────────────────────
/** POST /api/commissioner/reset */
export const resetQueue = (token) =>
  axios.post(`${BASE}/reset`, {}, authH(token)).then((r) => r.data);
