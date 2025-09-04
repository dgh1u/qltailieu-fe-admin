<template>
  <section class="p-8 space-y-6 bg-gray-50 min-h-screen">
    <!-- Dòng đầu: Mô tả và bộ chọn -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Welcome {{ fullName }}</h1>
        <p class="text-gray-600 text-sm">
          Hệ thống đang hoạt động ổn định! Bạn có
          <span class="text-indigo-600 font-semibold">
            {{ pendingPostCount }} bài viết chưa duyệt!
          </span>
        </p>
      </div>

      
      
    </div>

    <!-- Phần giữa: Hình minh họa và 4 box thống kê -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Desc image (trái) -->
      <div
        class="flex-1 bg-sky-50 shadow rounded-xl flex items-center justify-center"
      >
        <img
          src="@/assets/logo.png"
          alt="Desc"
          class="object-contain rounded-lg w-80 h-80"
        />
      </div>

      <!-- 4 Box thống kê (phải) -->
      <div class="flex-1 grid grid-cols-2 gap-10">
        <!-- Box: Total Users -->
        <div class="shadow rounded-xl p-4 flex flex-col bg-teal-100">
          <IconUsers class="w-8 h-8 text-blue-500 mb-2" />
          <span class="t font-semibold text-gray-600">Người dùng</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            {{ summary?.totalUsers }}
          </span>
        </div>
        
        <!-- Box: Total Posts -->
        <div class="bg-cyan-100 shadow rounded-xl p-4 flex flex-col">
          <IconFileText class="w-8 h-8 text-yellow-500 mb-2" />
          <span class="t font-semibold text-gray-600">Tài liệu</span>
          <span class="text-2xl font-bold text-gray-800 mt-4">
            {{ summary?.totalPosts }}
          </span>
        </div>
        
      </div>
    </div>

    <!-- Phần dưới: Biểu đồ thống kê số bài post theo thời gian -->
  

    <!-- Add chart section -->
    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold">Thống kê bài viết theo tháng</h2>
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedYear" 
            class="form-select rounded-md border-gray-300"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              Năm {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- Chart Container -->
      <div class="h-[400px] relative">
        <LineChart
          v-if="postChartData"
          :chart-data="postChartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "@/axios";

// Lucide Icons
import {
  Users as IconUsers,
  Banknote as IconBanknote,
  FileText as IconFileText,
  DollarSign as IconDollarSign,
} from "lucide-vue-next";

// Chart.js + vue-chart-3
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { LineChart, BarChart } from "vue-chart-3";
import { getListPost } from "@/apis/postService";
import { useAuthStore } from "@/stores/store";

const pendingPostCount = ref(0);
const authStore = useAuthStore();
const fullName = computed(() => authStore.user?.fullName || "Người dùng");

// API Data
const summary = ref(null); // /api/dashboard/summary
const revenueData = ref([]); // /api/dashboard/revenue

// Group mode: 'year' or 'month'
const groupMode = ref("year");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(1);

// Available years, months
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({length: 5}, (_, i) => currentYear - 2 + i);
});
const availableMonths = ref([
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
]);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
};

// Post chart data
const postChartData = ref({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [{
    label: 'Số lượng bài viết',
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    data: Array(12).fill(0),
    tension: 0.4,
    fill: false
  }]
});

async function fetchPendingPosts() {
  try {
    // Truyền params: approved = true và notApproved = true
    const res = await getListPost({ approved: true, notApproved: true });

    // Giả sử API trả về danh sách bài viết trong res.data
    pendingPostCount.value = res.data?.total || 0;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết chưa duyệt:", error);
  }
}

// Thống kê số liệu bài viết của người dùng theo ngày/tháng
const fetchUserPostStats = async () => {
  try {
    const start = `${selectedYear.value}-01-01`;
    const end = `${selectedYear.value}-12-31`;

    console.log('API Request Params:', {
      start,
      end,
      groupBy: 'month'
    });

    const response = await axios.get('/api/dashboard/post-stats', {
      params: {
        start,
        end,
        groupBy: 'month'
      }
    });

    if (response) {
      const monthlyData = Array(12).fill(0);
      
      response.forEach(item => {
        const month = parseInt(item.groupKey.split('-')[1]) - 1; // Convert to 0-based index
        monthlyData[month] = item.totalPosts;
      });

      postChartData.value = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
          label: 'Số lượng bài viết',
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
          data: monthlyData,
          tension: 0.4,
          fill: false
        }]
      };
    }
  } catch (error) {
    console.error('Error fetching post statistics:', error);
  }
};

// Lifecycle
onMounted(async () => {
  console.log('Component mounted');
  await fetchSummary();
  console.log('Summary fetched:', summary.value);
  
  await fetchPendingPosts();
  console.log('Pending posts count:', pendingPostCount.value);
  
  await fetchUserPostStats();
});

// Gọi API summary
async function fetchSummary() {
  try {
    const res = await axios.get("/api/dashboard/summary");
    summary.value = res;
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

// Thêm vào watch để theo dõi thay đổi
watch([groupMode, selectedYear, selectedMonth], () => {
  console.log('Filter changed:', {
    groupMode: groupMode.value,
    selectedYear: selectedYear.value,
    selectedMonth: selectedMonth.value
  });
  fetchUserPostStats();
});

// Watch for year changes
watch(selectedYear, () => {
  fetchUserPostStats();
});
</script>

<style scoped>

</style>
