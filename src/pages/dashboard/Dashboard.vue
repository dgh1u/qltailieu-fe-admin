<template>
  <section class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <!-- Header Section -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Chào mừng, {{ fullName }}</h1>
         
        </div>
        
        <div v-if="pendingPostCount > 0" class="bg-orange-50 px-4 py-2 rounded-lg">
          <span class="text-orange-700 text-sm font-medium">
            {{ pendingPostCount }} tài liệu chờ duyệt
          </span>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users Card -->
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm mb-1">Người dùng</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ summary?.totalUsers || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconUsers class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <!-- Total Posts Card -->
        <div class="bg-white rounded-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm mb-1">Tài liệu</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ summary?.totalPosts || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IconFileText class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Logo Section -->
        <div class="bg-white rounded-lg p-6 border border-gray-200 md:col-span-2 flex items-center justify-center">
          <img
            src="@/assets/logo.png"
            alt="Logo"
            class="object-contain w-32 h-32 opacity-80"
          />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Thống kê tài liệu</h2>
              <p class="text-gray-600 text-sm mt-0.5">Số lượng tài liệu theo từng tháng</p>
            </div>
            <select 
              v-model="selectedYear" 
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div class="p-6">
          <div class="h-[350px]">
            <LineChart
              v-if="postChartData"
              :chart-data="postChartData"
              :options="chartOptions"
            />
          </div>
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
        color: '#f3f4f6',
        drawBorder: false
      },
      ticks: {
        stepSize: 1,
        color: '#6b7280',
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
        color: '#6b7280',
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
      backgroundColor: '#1f2937',
      titleColor: '#f9fafb',
      bodyColor: '#f9fafb',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 6,
      padding: 10,
      displayColors: false,
      titleFont: {
        size: 12,
        weight: 'normal'
      },
      bodyFont: {
        size: 13,
        weight: '600'
      }
    }
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
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
    label: 'Số lượng tài liệu',
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

    // Giả sử API trả về danh sách tài liệu trong res.data
    pendingPostCount.value = res.data?.total || 0;
  } catch (error) {
    console.error("Lỗi khi lấy tài liệu chưa duyệt:", error);
  }
}

// Thống kê số liệu tài liệu của người dùng theo ngày/tháng
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
          label: 'Số lượng tài liệu',
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
