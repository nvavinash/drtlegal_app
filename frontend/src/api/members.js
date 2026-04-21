import axios from "axios";

const BASE = "http://localhost:5000/api/members";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Public: get approved members directory
export const getMembers = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

// Public: submit membership application
export const createMember = async (formData) => {
  const res = await axios.post(BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Admin: get ALL members
export const getAllMembersAdmin = async (token) => {
  const res = await axios.get(`${BASE}/all`, authHeaders(token));
  return res.data;
};

// Admin: get single member
export const getMemberById = async (id, token) => {
  const res = await axios.get(`${BASE}/${id}`, authHeaders(token));
  return res.data;
};

// Admin: update member (e.g. approve/reject)
export const updateMember = async (id, data, token) => {
  const isFormData = data instanceof FormData;
  const config = { ...authHeaders(token) };
  if (isFormData) config.headers["Content-Type"] = "multipart/form-data";
  const res = await axios.put(`${BASE}/${id}`, data, config);
  return res.data;
};

// Admin: delete member
export const deleteMember = async (id, token) => {
  const res = await axios.delete(`${BASE}/${id}`, authHeaders(token));
  return res.data;
};

// Admin: download member PDF
export const downloadMemberPdf = async (id, token) => {
  const res = await axios.get(`${BASE}/${id}/pdf`, {
    ...authHeaders(token),
    responseType: "blob",
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  
  // Try to determine filename from content-disposition header if available, otherwise fallback
  let filename = `Member_Application_${id}.pdf`;
  const disposition = res.headers["content-disposition"];
  if (disposition && disposition.indexOf("attachment") !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) { 
      filename = matches[1].replace(/['"]/g, "");
    }
  }
  
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
