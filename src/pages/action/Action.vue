<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <!-- Header Section -->
    <div class="px-8 pt-8 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800 mb-2">Nhật ký hoạt động</h1>
          <p class="text-slate-500 text-sm">Theo dõi các hoạt động trong hệ thống</p>
        </div>
        
        <!-- Search Input -->
        <div class="flex items-center">
          <div class="relative">
            <a-input
              v-model:value="filterUserId"
              placeholder="Tìm theo User ID..."
              allowClear
              class="w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              @input="handleFilterChange"
            />
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="px-8 pb-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="p-6">
            <!-- Timeline Container -->
            <div class="relative">
              <!-- Timeline Line -->
              <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"></div>
              
              <!-- Timeline Items -->
              <div class="space-y-8">
                <div
                  v-for="(action, index) in actions"
                  :key="action.id"
                  class="relative flex items-start group"
                >
                  <!-- Timeline Node -->
                  <div class="relative z-10 flex items-center justify-center">
                    <div
                      class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg ring-4 ring-white transition-transform duration-200 group-hover:scale-110"
                      :class="actionColor(action.action)"
                    >
                      <component
                        :is="actionIcon(action.action)"
                        class="w-5 h-5 text-white"
                      />
                    </div>
                  </div>

                  <!-- Content Card -->
                  <div class="ml-6 flex-1">
                    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-slate-100 transition-colors duration-200">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="actionBadgeColor(action.action)">
                            {{ actionText(action.action) }}
                          </span>
                        </div>
                        <time class="text-xs text-slate-500 font-medium">
                          {{ formatTime(action.time) }}
                        </time>
                      </div>

                      <div class="text-sm text-slate-700 leading-relaxed">
                        <template v-if="action.action === 'CREATE'">
                          <span class="font-semibold text-slate-800">{{ action.fullName }}</span> 
                          đã tạo tài liệu 
                          <span class="font-medium text-blue-600">"{{ action.postTitle }}"</span>
                          <span class="text-slate-500">(ID: {{ action.postId }})</span>
                          đang chờ kiểm duyệt.
                        </template>
                        <template v-else-if="action.action === 'APPROVE'">
                          <span class="font-semibold text-slate-800">ADMIN</span> 
                          đã duyệt tài liệu 
                          <span class="font-medium text-blue-600">"{{ action.postTitle }}"</span>
                          <span class="text-slate-500">(ID: {{ action.postId }})</span>.
                        </template>
                        <template v-else-if="action.action === 'BLOCK'">
                          <span class="font-semibold text-slate-800">ADMIN</span> 
                          đã khóa tài liệu 
                          <span class="font-medium text-blue-600">"{{ action.postTitle }}"</span>
                          <span class="text-slate-500">(ID: {{ action.postId }})</span>.
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="px-8 pb-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4">
          <div class="flex justify-center">
            <a-pagination
              :current="pagination.current"
              :pageSize="pagination.pageSize"
              :total="pagination.total"
              :showTotal="pagination.showTotal"
              @change="handlePageChange"
              class="custom-pagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Search, PlusCircle, CheckCircle2, XCircle } from "lucide-vue-next";
import { getListAction } from "@/apis/actionService";
import { getPostsByUserId } from "@/apis/postService"; // <-- API lấy post theo userId

const actions = ref([]);
const filterUserId = ref("");

// Giữ pageSize <= 50
const pagination = ref({
  current: 1,
  pageSize: 5, // mặc định 5
  total: 0,
  showTotal: (total) => `Tổng cộng: ${total} bản ghi`,
});

const fetchActions = async () => {
  try {
    // Nếu chưa nhập userId, lấy tất cả action
    if (!filterUserId.value.trim()) {
      const params = {
        start: pagination.value.current - 1,
        limit: Math.min(pagination.value.pageSize, 50), // <= 50
      };
      const res = await getListAction(params);
      const result = res.data.data || res.data;
      actions.value = result.items;
      pagination.value.total = result.total;
    } else {
      // Lấy tất cả tài liệu của user => limit cũng <= 50
      const postRes = await getPostsByUserId(filterUserId.value.trim(), {
        start: 0,
        limit: 50,
      });
      const postData = postRes.data.data || postRes.data;
      const postItems = postData.items || [];

      // Gom mảng postId
      const postIds = postItems.map((p) => p.id);
      // Chuyển thành chuỗi CSV, vd: "39,38,29"
      const postIdsCsv = postIds.join(",");

      // Gọi getListAction với postIds kiểu CSV
      const actionParams = {
        start: pagination.value.current - 1,
        limit: Math.min(pagination.value.pageSize, 50),
        postIds: postIdsCsv, // "39,38,29"
      };
      const actionRes = await getListAction(actionParams);
      const actionResult = actionRes.data.data || actionRes.data;
      actions.value = actionResult.items;
      pagination.value.total = actionResult.total;
    }
  } catch (error) {
    console.error("fetchActions error:", error);
  }
};

const handleFilterChange = () => {
  pagination.value.current = 1;
  fetchActions();
};

const handlePageChange = (page) => {
  pagination.value.current = page;
  fetchActions();
};

const formatTime = (arr) => {
  if (!Array.isArray(arr) || arr.length !== 6) return "";
  const [y, m, d, hh, mm, ss] = arr;
  return (
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ` +
    `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(
      ss
    ).padStart(2, "0")}`
  );
};

const actionIcon = (type) => {
  return (
    {
      CREATE: PlusCircle,
      APPROVE: CheckCircle2,
      BLOCK: XCircle,
    }[type] || PlusCircle
  );
};

const actionColor = (type) => {
  return (
    {
      CREATE: "bg-gradient-to-r from-blue-500 to-blue-600",
      APPROVE: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      BLOCK: "bg-gradient-to-r from-red-500 to-red-600",
    }[type] || "bg-gradient-to-r from-slate-400 to-slate-500"
  );
};

const actionBadgeColor = (type) => {
  return (
    {
      CREATE: "bg-blue-100 text-blue-700 border border-blue-200",
      APPROVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      BLOCK: "bg-red-100 text-red-700 border border-red-200",
    }[type] || "bg-slate-100 text-slate-700 border border-slate-200"
  );
};

const actionText = (type) => {
  return (
    {
      CREATE: "Tạo mới",
      APPROVE: "Đã duyệt", 
      BLOCK: "Đã khóa",
    }[type] || "Khác"
  );
};

onMounted(fetchActions);
</script>

<style scoped>
/* Custom pagination styling */
:deep(.custom-pagination .ant-pagination-item) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s;
}

:deep(.custom-pagination .ant-pagination-item:hover) {
  border-color: #3b82f6;
  background: #f8fafc;
}

:deep(.custom-pagination .ant-pagination-item-active) {
  background: #3b82f6;
  border-color: #3b82f6;
}

:deep(.custom-pagination .ant-pagination-item-active a) {
  color: white;
}

:deep(.custom-pagination .ant-pagination-prev, .custom-pagination .ant-pagination-next) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s;
}

:deep(.custom-pagination .ant-pagination-prev:hover, .custom-pagination .ant-pagination-next:hover) {
  border-color: #3b82f6;
  background: #f8fafc;
}
</style>
