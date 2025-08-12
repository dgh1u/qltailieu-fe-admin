import axios from "@/axios";

export const uploadDocument = async (postId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios({
    url: `/api/document/upload/${postId}`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocumentsByPost = async (postId) => {
  return axios({
    url: `/api/documents/${postId}`,
    method: "GET",
  });
};

export const downloadDoc = async (docId) => {
  return await axios.get(`/api/document/download/${docId}`, {
    responseType: "blob",
  });
};

export const downloadDocument = async (documentId) => {
  return axios({
    url: `/api/document/${documentId}`,
    method: "GET",
    responseType: "blob",
  });
};

export const deleteSingleDocument = async (documentId) => {
  return axios({
    url: `/api/document/${documentId}`,
    method: "DELETE",
  });
};
