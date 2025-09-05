<template>
  <section class="p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-light text-slate-800 mb-2">Chào mừng, {{ fullName }}</h1>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <p class="text-slate-500 text-sm">
              Hệ thống đang hoạt động ổn định
            </p>
          </div>
        </div>
        
        <div v-if="pendingPostCount > 0" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            <span class="text-amber-700 text-sm font-medium">
              {{ pendingPostCount }} bài viết chờ duyệt
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Logo Section -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-slate-200/60 p-8 h-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
          <img
            src="@/assets/logo.png"
            alt="Logo"
            class="object-contain w-48 h-48 opacity-90"
          />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="lg:col-span-2">
        <div class="grid grid-cols-2 gap-6">
          <!-- Total Users Card -->
          <div class="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex items-start justify-between">
              <div>
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <IconUsers class="w-6 h-6 text-blue-600" />
                </div>
                <p class="text-slate-500 text-sm font-medium mb-1">Người dùng</p>
                <p class="text-2xl font-semibold text-slate-800">
                  {{ summary?.totalUsers || 0 }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Total Posts Card -->
          <div class="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex items-start justify-between">
              <div>
                <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <IconFileText class="w-6 h-6 text-emerald-600" />
                </div>
                <p class="text-slate-500 text-sm font-medium mb-1">Tài liệu</p>
                <p class="text-2xl font-semibold text-slate-800">
                  {{ summary?.totalPosts || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total Payments Card -->
          <div class="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex items-start justify-between">
              <div>
                <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <IconBanknote class="w-6 h-6 text-amber-600" />
                </div>
                <p class="text-slate-500 text-sm font-medium mb-1">Giao dịch</p>
                <p class="text-2xl font-semibold text-slate-800">
                  {{ summary?.totalPayments || 0 }}
                </p>
              </div>
            </div>
          </div>

          <!-- Total Revenue Card -->
          <div class="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-md transition-all duration-300 group">
            <div class="flex items-start justify-between">
              <div>
                <div class="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                  <IconDollarSign class="w-6 h-6 text-violet-600" />
                </div>
                <p class="text-slate-500 text-sm font-medium mb-1">Doanh thu</p>
                <p class="text-2xl font-semibold text-slate-800">
                  {{ (summary?.totalRevenue || 0).toLocaleString() }}₫
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần dưới: Biểu đồ thống kê số bài post theo thời gian -->
  

    <!-- Chart Section -->
    <div class="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="p-6 border-b border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-slate-800">Thống kê bài viết</h2>
            <p class="text-slate-500 text-sm mt-1">Số lượng bài viết theo từng tháng trong năm</p>
          </div>
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-600">Năm:</label>
            <select 
              v-model="selectedYear" 
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="h-[400px] relative">
          <LineChart
            v-if="postChartData"
            :chart-data="postChartData"
            :options="chartOptions"
          />
        </div>
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
  interaction: {
    intersect: false,
    mode: 'index'
  },
  scales: {
    y: {
      beginAtZero: true,
      border: {
        display: false
      },
      grid: {
        color: '#f1f5f9',
        drawBorder: false
      },
      ticks: {
        stepSize: 1,
        color: '#64748b',
        font: {
          size: 12
        },
        padding: 8
      }
    },
    x: {
      border: {
        display: false
      },
      grid: {
        display: false
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12
        },
        padding: 8
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f1f5f9',
      bodyColor: '#f1f5f9',
      borderColor: '#334155',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      displayColors: false,
      titleFont: {
        size: 13,
        weight: 'normal'
      },
      bodyFont: {
        size: 14,
        weight: 'bold'
      }
    }
  },
  elements: {
    point: {
      radius: 6,
      hoverRadius: 8,
      backgroundColor: '#3b82f6',
      borderColor: '#ffffff',
      borderWidth: 2
    }
  }
};

// Post chart data
const postChartData = ref({
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  datasets: [{
    label: 'Số lượng bài viết',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
    pointBackgroundColor: '#3b82f6',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 8,
    data: Array(12).fill(0),
    tension: 0.4,
    fill: true
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
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [{
          label: 'Số lượng bài viết',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#3b82f6',
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          data: monthlyData,
          tension: 0.4,
          fill: true
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
