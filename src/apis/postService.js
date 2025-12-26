import axios from "@/axios";

// Lấy tất cả tài liệu
export const getListPost = async (params) => {
  return axios({
    url: "/api/posts",
    method: "GET",
    params: params,
  });
};

// Lấy chi tiết 1 tài liệu
export const getDetailPost = async (id) => {
  return axios({
    url: `api/post/${id}`,
    method: "GET",
  });
};

// Lấy danh sách tài liệu của một người dùng theo userId
export const getPostsByUserId = async (idUser, params) => {
  return axios({
    url: `/api/posts/${idUser}`,
    method: "GET",
    params: params,
  });
};

// Tạo tài liệu mới
export const createPost = async (data) => {
  return axios({
    url: `/api/post`,
    method: "POST",
    data,
  });
};

// Cập nhật tài liệu
export const updatePost = async (id, data) => {
  return axios({
    url: `/api/post/${id}`,
    method: "PUT",
    data,
  });
};

// Duyệt/Khóa một tài liệu (Admin only)
export const approvePost = async (id, bool) => {
  return axios({
    url: `/api/post/${id}/approve/${bool}`,
    method: "PUT",
  });
};

// Xóa tài liệu (Admin only)
export const deletePost = async (id) => {
  return axios({
    url: `/api/post/${id}`,
    method: "DELETE",
  });
};
