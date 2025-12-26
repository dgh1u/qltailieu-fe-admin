import axios from "@/axios";

// Lấy tất cả tài liệu
export const getListAction = async (params) => {
  return axios({
    url: "/api/actions",
    method: "GET",
    params: params,
  });
};
