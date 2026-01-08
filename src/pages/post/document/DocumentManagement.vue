<template>
  <div class="p-4 pt-12">
    <DocumentDetail
      v-if="selectedPostId"
      v-model:open="showDocumentDetailPopup"
      :postId="selectedPostId"
    />

    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder="Nhập Tiêu đề tài liệu..."
          style="width: 200px"
          allowClear
          class="custom-search"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Bộ lọc Phân loại Tài liệu -->
        <a-select
          
          v-model:value="selectedSecondMotel"
          placeholder="Phân loại"
          style="width: 150px"
          @change="handleFilterChange"
        >
        <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="Giáo trình">Giáo trình</a-select-option>
          <a-select-option value="Sách tham khảo"
            >Sách tham khảo</a-select-option
          >
          <a-select-option value="Khóa luận tốt nghiệp"
            >Khóa luận tốt nghiệp</a-select-option
          >
          <a-select-option value="Báo cáo thực tập"
            >Báo cáo thực tập</a-select-option
          >
          <a-select-option value="Nghiên cứu khoa học"
            >Nghiên cứu khoa học</a-select-option
          >
          <a-select-option value="Bài báo khoa học"
            >Bài báo khoa học</a-select-option
          >
          <a-select-option value="Tài liệu khác">Tài liệu khác</a-select-option>
        </a-select>

        <!-- Bộ lọc Chuyên ngành-->
        <a-select
          
          v-model:value="selectedMajor"
          placeholder="Phân loại"
          style="width: 150px"
          @change="handleFilterChange"
        >
        <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="Thú y">Thú y</a-select-option>
              <a-select-option value="Chăn nuôi - Thủy sản"
                >Chăn nuôi - Thủy sản</a-select-option
              >
              <a-select-option value="Cơ điện">Cơ điện</a-select-option>
              <a-select-option value="Công nghệ thông tin"
                >Công nghệ thông tin</a-select-option
              >
              <a-select-option value="Kinh tế">Kinh tế</a-select-option>
              <a-select-option value="Công nghệ sinh học"
                >Công nghệ sinh học</a-select-option
              >
              <a-select-option value="Công nghệ thực phẩm"
                >Công nghệ thực phẩm</a-select-option
              >
              <a-select-option value="Nông học">Nông học</a-select-option>
              <a-select-option value="Khoa học môi trường"
                >Khoa học môi trường</a-select-option
              >
              <a-select-option value="Xã hội học">Xã hội học</a-select-option>
              <a-select-option value="Ngôn ngữ">Ngôn ngữ</a-select-option>
              <a-select-option value="Du lịch">Du lịch</a-select-option>
              <a-select-option value="Sư phạm">Sư phạm</a-select-option>
              <a-select-option value="Quản lý đất đai"
                >Quản lý đất đai</a-select-option
              >
              <a-select-option value="Sư phạm">Sư phạm</a-select-option>
        </a-select>

        <!-- Bộ lọc trạng thái -->
        <a-select
          v-model:value="selectedStatus"
          placeholder="Trạng thái"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'APPROVED'">Đã duyệt</a-select-option>
          <a-select-option :value="'BLOCKED'">Bị khóa</a-select-option>
          <a-select-option :value="'PENDING'">Chờ duyệt</a-select-option>
        </a-select>

        <!-- Bộ lọc Hiển thị -->
        <a-select
          v-model:value="selectedDel"
          placeholder="Hiển thị"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'false'">Hiển thị</a-select-option>
          <a-select-option :value="'true'">Bị ẩn</a-select-option>
        </a-select>

        <!-- Bộ lọc theo UserId -->
        <a-input
          v-model:value="selectedUserId"
          placeholder="Nhập ID người đăng..."
          style="width: 200px"
          @input="handleFilterChange"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>
      </div>
    </div>

    <!-- Bảng danh sách tài liệu -->
    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      :pagination="{
        ...pagination,
        align: 'center',
        position: ['bottomCenter']
      }"
      row-key="id"
      @change="handleTableChange"
      class="custom-table"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- STT -->
        <template v-if="column.key === 'stt'">
          {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
        </template>

        <template v-if="column.key === 'major'">
          {{ record.criteriaDTO.major }}
        </template>

        <template v-if="column.key === 'secondMotel'">
          {{ record.criteriaDTO.secondMotel }}
        </template>

        <!-- Tiêu đề -->
        <template v-if="column.key === 'title'">
          {{ record.title }}
        </template>

        <!-- Ngày tạo -->
        <template v-if="column.key === 'createAt'">
          <!-- Thay thế 'T' bằng khoảng trắng -->
          {{
            record.createAt
              ? record.createAt.replace("T", " ")
              : "Không có dữ liệu"
          }}
        </template>

        <!-- Trạng thái duyệt -->
        <template v-if="column.key === 'approved'">
          <a-tag
            :color="
              record.approved && !record.notApproved
                ? 'green'
                : record.approved && record.notApproved
                ? 'orange'
                : 'red'
            "
          >
            {{
              record.approved && !record.notApproved
                ? "Đã duyệt"
                : record.approved && record.notApproved
                ? "Chờ duyệt"
                : "Bị khóa"
            }}
          </a-tag>
        </template>

        <!-- Cột Hiển thị -->
        <template v-if="column.key === 'del'">
          <a-tag :color="record.del ? 'red' : 'green'">
            {{ record.del ? "Bị ẩn" : "Hiển thị" }}
          </a-tag>
        </template>

        <!-- Người đăng -->
        <template v-if="column.key === 'user'">
          {{ record.userDTO ? record.userDTO.fullName : "Không có thông tin" }}
        </template>

        <!-- Hành động -->
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="viewPost(record)">
            <template #icon><EyeOutlined /></template>
          </a-button>

          <a-button type="link" danger @click="confirmDelete(record)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getListPost, deletePost } from "@/apis/postService";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import DocumentDetail from "./DocumentDetail.vue";

export default {
  components: {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,

    DocumentDetail,
  },
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null);
    const pagination = ref({
      current: 1,
      pageSize: 6,
      total: 0,
      showTotal: (total, range) => `Tổng cộng: ${total} tài liệu`,
    });
    const showDocumentDetailPopup = ref(false);
    const selectedPostId = ref(null);
    // Các bộ lọc
    const selectedUserId = ref(null);
    const selectedDel = ref(null);
    const selectedSecondMotel = ref(null);
    const selectedMajor = ref(null);


    // Cấu hình các cột hiển thị trong bảng
    const columns = [
      { title: "STT", key: "stt" },
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Tiêu đề", dataIndex: "title", key: "title" },
      { title: "Chuyên ngành", dataIndex: "major", key: "major" },
      { title: "Loại tài liệu", dataIndex: "secondMotel", key: "secondMotel" },
      { title: "Ngày tạo", dataIndex: "createAt", key: "createAt" },
      { title: "Trạng thái", key: "approved" },
      { title: "Người đăng", key: "user" },
      { title: "Hành động", key: "action", width: 96 },
    ];

    // Lấy danh sách tài liệu từ API
    const fetchPosts = async () => {
      loading.value = true;
      try {
        // Tạo tham số truy vấn
        const params = {
          start: Math.max(pagination.value.current - 1, 0),
          limit: pagination.value.pageSize,
          keywords: searchText.value.trim(),
        };

        // Áp dụng bộ lọc trạng thái
        switch (selectedStatus.value) {
          case "APPROVED":
            params.approved = true;
            params.notApproved = false;
            break;
          case "BLOCKED":
            params.approved = false;
            break;
          case "PENDING":
            params.approved = true;
            params.notApproved = true;
            break;
          default:
            break;
        }

        // Áp dụng các bộ lọc khác
        if (selectedUserId.value) {
          params.userId = selectedUserId.value;
        }

        if (selectedDel.value) {
          params.del = selectedDel.value;
        }

        params.motels = "TAI_LIEU";

        if (selectedSecondMotel.value) {
          params.secondMotel = selectedSecondMotel.value;
        }

        if (selectedMajor.value) {
          params.major = selectedMajor.value;
        }

        const res = await getListPost(params);

        // Xử lý dữ liệu trả về
        if (res.data && res.data.items) {
          posts.value = res.data.items;
          pagination.value.total = res.data.total || 0;
        } else {
          throw new Error("Dữ liệu API không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        message.error(`Lỗi tải danh sách tài liệu: ${error.message}`);
      }
      loading.value = false;
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (paginationObj) => {
      pagination.value.current = Math.max(paginationObj.current, 1);
      pagination.value.pageSize = paginationObj.pageSize;
      fetchPosts();
    };

    // Xử lý tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1;
      fetchPosts();
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = () => {
      pagination.value.current = 1;
      fetchPosts();
    };

    // Xem chi tiết tài liệu
    const viewPost = (record) => {
      selectedPostId.value = record.id;
      showDocumentDetailPopup.value = true;
    };

    // Xác nhận xóa tài liệu
    const confirmDelete = (record) => {
      Modal.confirm({
        title: "Xóa tài liệu",
        content: "Bạn có chắc chắn muốn xóa tài liệu này?",
        okText: "Xóa",
        cancelText: "Hủy",
        async onOk() {
          try {
            await deletePost(record.id);
            message.success("Xóa tài liệu thành công");
            fetchPosts();
          } catch {
            message.error("Xóa tài liệu thất bại");
          }
        },
      });
    };

    // Khởi tạo - tải danh sách tài liệu
    onMounted(fetchPosts);

    return {
      posts,
      columns,
      loading,
      searchText,
      selectedStatus,
      pagination,
      fetchPosts,
      handleTableChange,
      handleSearch,
      handleFilterChange,
      confirmDelete,
      viewPost,

      showDocumentDetailPopup,
      selectedPostId,
      selectedUserId,
      selectedDel,
      selectedSecondMotel,
      selectedMajor,
    };
  },
};
</script>

<style scoped>
.ant-pagination .ant-pagination-total-text {
  float: left;
}

/* Custom header styling cho bảng */
:deep(.custom-table .ant-table-thead > tr > th) {
  background-color: #374151 !important; /* gray-800 */
  color: white !important;
  border-bottom: 1px solid #374151 !important;
  font-weight: 600;
}

/* Đảm bảo màu không đổi khi hover */
:deep(.custom-table .ant-table-thead > tr > th:hover) {
  background-color: #374151 !important;
  color: white !important;
}

/* Tùy chỉnh cho sorter icon nếu có */
:deep(.custom-table .ant-table-thead > tr > th .ant-table-column-sorter) {
  color: white !important;
}

/* Tùy chỉnh cho filter icon nếu có */
:deep(.custom-table .ant-table-thead > tr > th .ant-table-filter-trigger) {
  color: white !important;
}
</style>
