<template>
  <div class="flex flex-col h-full" style="background-color: #374151;">
    <!-- Logo -->
    <div class="flex items-center justify-center h-32 mt-4 mb-6">
      <svg width="240" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151" />
        <image
          href="@/assets/logo.png"
          x="70"
          y="10"
          height="100"
          width="100"
        />
      </svg>
    </div>

    <!-- Sidebar Menu -->
    <a-menu
      mode="inline"
      theme="dark"
      v-model:selectedKeys="selectedKeys"
      style="background-color: #374151;"
    >
      <!-- Tất cả menu items -->
      <a-menu-item v-for="item in allMenuItems" :key="item.path">
        <router-link :to="item.path" class="flex items-center gap-3">
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Wallet, Users, FileText, ChartPie, Activity } from "lucide-vue-next";

const menuItems = [
  { label: "Thống kê", path: "/home/dashboard", icon: ChartPie },
  { label: "Hoạt động", path: "/home/action", icon: Activity },
  { label: "Người dùng", path: "/home/user", icon: Users },
  { label: "Tài liệu", path: "/home/post/document", icon: FileText },
  //{ label: "Nạp tiền", path: "/home/payment", icon: Wallet },
];

// Tất cả menu items (đã bỏ menu 2 tầng)
const allMenuItems = computed(() => menuItems);

// Điều khiển trạng thái menu
const selectedKeys = ref(["dashboard"]);
</script>