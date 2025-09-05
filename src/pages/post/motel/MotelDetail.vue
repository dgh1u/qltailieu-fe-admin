<template>
  <a-modal
    v-model:open="modalVisible"
    :footer="null"
    @cancel="handleClose"
    width="800px"
  >
    <div class="create-post space-y-4">
      <!-- Tiêu đề tin đăng -->
      <div class="block flex items-center justify-center">
        <span class="font-bold text-3xl text-teal-500">Chi tiết tin đăng</span>
      </div>

      <!-- Thông tin Hình thức -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Hình thức</span>
        </div>
        <label> Loại hình <span class="text-red-500">*</span> </label>
        <div class="flex rounded-lg mt-1 p-2">
          <span class="font-bold" :class="motelColor">{{ displayMotel }}</span>
        </div>
        <!-- Trạng thái -->
        <div class="py-2">
          <label>Trạng thái</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagStatusColor" class="font-bold">{{
              displayStatus
            }}</a-tag>
          </div>
        </div>
        <!-- Hiển thị -->
        <div class="py-2">
          <label>Hiển thị</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagVisibilityColor" class="font-bold">{{
              displayVisibility
            }}</a-tag>
          </div>
        </div>
      </div>

      <div class="py-2">
        <span class="font-bold text-base">Hình ảnh</span>
      </div>
      <!-- Gallery hình ảnh -->
      <div class="bg-white rounded-xl p-4 text-4xl shadow-lg">
        <div
          v-if="galleryImages.length > 0"
          class="relative w-full h-96 bg-black text-white flex items-center justify-center mb-4 rounded-xl"
        >
          <button
            class="absolute left-0 px-4 py-2 text-3xl"
            @click="prevImage"
            :disabled="galleryImages.length === 0"
          >
            &lt;
          </button>

          <img
            :src="galleryImages[currentImageIndex]"
            alt="gallery image"
            class="max-w-3xl max-h-full max-w-150 object-contain"
          />

          <button
            class="absolute right-0 px-4 py-2 text-3xl"
            @click="nextImage"
            :disabled="galleryImages.length === 0"
          >
            &gt;
          </button>
        </div>
        <!-- Hàng thumbnail, cuộn ngang -->
        <div
          class="flex space-x-2 overflow-x-auto mb-6 items-center justify-center"
        >
          <div
            v-for="(img, index) in galleryImages"
            :key="index"
            @click="currentImageIndex = index"
            class="cursor-pointer flex-shrink-0 w-20 h-20 border rounded"
            :class="{
              'border-blue-500': currentImageIndex === index,
              'border-gray-300': currentImageIndex !== index,
            }"
          >
            <img
              :src="img"
              alt="Thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin mô tả tin đăng -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Thông tin mô tả</span>
        </div>
        <div class="py-2">
          <label>Tiêu đề</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.title"
              type="text"
              placeholder="Nhập tiêu đề"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="py-2">
          <span class="block">Nội dung mô tả</span>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <textarea
              v-model="formData.content"
              placeholder="Nhập nội dung mô tả"
              rows="4"
              class="w-full p-2 mt-1 border-none outline-none rounded-lg bg-gray-50"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="py-2">
          <label>Giá cho thuê</label>
          <div class="flex border border-gray-300 rounded-lg mt-1 w-120">
            <input
              v-model.number="formData.criteria.price"
              type="number"
              placeholder="VD: 1000000 (cho 1 triệu)"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/tháng</span>
          </div>
          <small class="text-gray-500">
            Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000
          </small>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Diện tích</label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.criteria.acreage"
              type="number"
              placeholder="Nhập diện tích"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">m²</span>
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Giá điện</label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.criteria.electricPrice"
              type="number"
              placeholder="VD: 3500"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/kWh</span>
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Giá nước</label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.criteria.waterPrice"
              type="number"
              placeholder="VD: 30000"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/m³</span>
          </div>
        </div>
      </div>

      <!-- Thông tin Giới tính (áp dụng khi Motel là O_GHEP) -->
      <div
        v-if="formData.criteria.motel === 'O_GHEP'"
        class="block bg-white rounded-xl p-4"
      >
        <div class="py-2">
          <span class="font-bold text-base">Giới tính</span>
        </div>
        <label>Giới tính yêu cầu</label>
        <div class="flex border border-gray-300 rounded-lg mt-1">
          <input
            v-model="displayGender"
            type="text"
            placeholder="Chọn giới tính"
            class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
            disabled
          />
        </div>
      </div>

      <!-- Thông tin Khu vực & Địa chỉ -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Khu vực</span>
        </div>
        <div class="py-2">
          <label>Khu vực</label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="displayDistrict"
              type="text"
              placeholder="Chọn khu vực"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Địa chỉ</label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model="formData.criteria.address"
              type="text"
              placeholder="VD: Số 12, Ngõ 34..."
              class="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="map-wrapper py-2">
          <label class="block text-gray-700">Bản đồ</label>
          <div class="flex items-center border border-gray-300 rounded-lg mt-1">
            <iframe
              width="100%"
              height="300"
              class="border-0"
              :src="`https://www.google.com/maps?q=${encodeURIComponent(
                displayMapAddress
              )}&output=embed`"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Hiển thị Đặc điểm nổi bật -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Đặc điểm nổi bật</span>
        </div>
        <div class="grid grid-cols-2 gap-y-3">
          <div
            v-for="(feature, idx) in featureOptions"
            :key="idx"
            class="flex items-center p-2 rounded-lg"
            :class="{ 'text-teal-500': formData.criteria[feature.value] }"
          >
            <div class="relative">
              <input
                type="checkbox"
                class="hidden"
                :checked="formData.criteria[feature.value]"
                readonly
              />
              <div
                class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
                :class="{
                  'bg-teal-500 border-teal-500':
                    formData.criteria[feature.value],
                }"
              >
                <CheckIcon
                  v-if="formData.criteria[feature.value]"
                  class="w-3 h-3 text-white"
                />
              </div>
            </div>
            <span class="ml-2 text-sm">{{ feature.label }}</span>
          </div>
        </div>
      </div>

      <!-- PHẦN TÀI LIỆU -->
      <div v-if="documents && documents.length > 0">
        <div class="block bg-white rounded-xl p-4">
          <div class="py-2">
            <span class="font-bold text-base">Tài liệu đính kèm</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
              @click="handleDocumentClick(doc)"
            >
              <!-- File Icon -->
              <!-- File Icon -->
              <div
                class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3"
              >
                <!-- PDF Icon -->
                <img
                  v-if="doc.fileType && doc.fileType.includes('pdf')"
                  src="@/assets/fileLogo/pdf.svg"
                  alt="PDF"
                  class="w-6 h-6"
                />
                <!-- Word Icon -->
                <img
                  v-else-if="
                    doc.fileType &&
                    (doc.fileType.includes('word') ||
                      doc.fileName.includes('.docx') ||
                      doc.fileName.includes('.doc'))
                  "
                  src="@/assets/fileLogo/word.svg"
                  alt="Word Document"
                  class="w-6 h-6"
                />
                <!-- PowerPoint Icon -->
                <img
                  v-else-if="
                    doc.fileType &&
                    (doc.fileType.includes('presentation') ||
                      doc.fileName.includes('.ppt') ||
                      doc.fileName.includes('.pptx'))
                  "
                  src="@/assets/fileLogo/pp.svg"
                  alt="PowerPoint Presentation"
                  class="w-6 h-6"
                />
                <!-- Excel Icon -->
                <img
                  v-else-if="
                    doc.fileType &&
                    (doc.fileType.includes('excel') ||
                      doc.fileType.includes('spreadsheet') ||
                      doc.fileName.includes('.xlsx') ||
                      doc.fileName.includes('.xls'))
                  "
                  src="@/assets/fileLogo/excel.svg"
                  alt="Excel Spreadsheet"
                  class="w-6 h-6"
                />

                <!-- Zip Icon -->
                <img
                  v-else-if="
                    doc.fileType && doc.fileType.includes('x-zip-compressed')
                  "
                  src="@/assets/fileLogo/zip.png"
                  alt="Zip"
                  class="w-6 h-6"
                />

                <!-- Default File Icon -->
                <svg
                  v-else
                  class="w-6 h-6 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z" />
                </svg>
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate mb-1">
                  {{ doc.fileName }}
                </p>
                <span
                  class="text-xs text-gray-500 mb-1 flex justify-between items-center"
                >
                  <span>{{
                    getFileTypeText(doc.fileType || doc.fileName)
                  }}</span>
                  <!-- Download hint hiện sát phải khi hover -->
                  <span
                    class="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                  >
                    Click để tải về
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- PHẦN LINK THAM KHẢO -->
      <div v-if="formData.criteria.referenceUrl" class="pt-4">
        <div class="block bg-white rounded-xl p-4">
          <div class="py-2">
            <span class="font-bold text-base">Link tham khảo</span>
          </div>

          <a
            :href="formData.criteria.referenceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <!-- Link Icon -->
            <div
              class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
            </div>

            <!-- Link Info -->
            <div class="flex-1 min-w-0">
              <span
                class="block text-teal-600 group-hover:text-teal-800 font-medium text-sm mb-1"
              >
                Đường dẫn tới tài liệu tham khảo
              </span>
              <p class="text-xs text-gray-500">Click để xem chi tiết</p>
            </div>

            <!-- External Link Icon -->
            <div class="flex-shrink-0 ml-2">
              <svg
                class="w-4 h-4 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </div>
          </a>
        </div>
      </div>
      <!-- Các nút hành động -->
      <div class="pt-10" v-if="displayStatus === 'Chờ duyệt'">
        <div class="flex space-x-5">
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleBlock"
              class="px-3 py-2 bg-red-500 text-white rounded-lg w-full"
            >
              Khóa bài
            </button>
          </div>
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleApprove"
              class="px-3 py-2 bg-green-500 text-white rounded-lg w-full"
            >
              Duyệt bài
            </button>
          </div>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Đã duyệt'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleBlock"
            class="w-full px-3 py-2 bg-red-500 text-white rounded-lg"
          >
            Khóa bài
          </button>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Bị khóa'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleApprove"
            class="w-full px-3 py-2 bg-green-500 text-white rounded-lg"
          >
            Mở khóa
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
import { message } from "ant-design-vue";
import { Check as CheckIcon } from "lucide-vue-next";
import { getDetailPost, approvePost } from "@/apis/postService.js";
import { downloadDoc } from "@/apis/documentService.js";

const documents = ref([]);

const props = defineProps({
  open: { type: Boolean, default: false },
  postId: { type: [String, Number], default: "" },
});
const emit = defineEmits(["update:open"]);

const modalVisible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Biến chứa danh sách URL hình ảnh dạng gallery
const galleryImages = ref([]);

// Biến điều hướng ảnh
const currentImageIndex = ref(0);
const nextImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % galleryImages.value.length;
  }
};
const prevImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) %
      galleryImages.value.length;
  }
};

// Dữ liệu form
const formData = reactive({
  title: "",
  content: "",
  approved: false,
  notApproved: false,
  del: false,
  criteria: {
    motel: "",
    price: 0,
    acreage: 0,
    electricPrice: 0,
    waterPrice: 0,
    gender: null,
    address: "",
    idDistrict: "",
    interior: false,
    airConditioner: false,
    heater: false,
    internet: false,
    toilet: false,
    time: false,
    parking: false,
    security: false,
    owner: false,
    kitchen: false,
  },
});

// Danh sách khu vực
const districtList = ref([
  { id: 1, name: "An Đào" },
  { id: 4, name: "Đào Nguyên" },
  { id: 5, name: "Cửu Việt" },
  { id: 6, name: "Thành Chung" },
  { id: 7, name: "Ngô Xuân Quảng" },
  { id: 8, name: "Vinhomes Ocean Park" },
  { id: 9, name: "Khác" },
]);

// Danh sách đặc điểm nổi bật
const featureOptions = ref([
  { label: "Đầy đủ nội thất", value: "interior" },
  { label: "Có điều hòa", value: "airConditioner" },
  { label: "Có nóng lạnh", value: "heater" },
  { label: "Có internet", value: "internet" },
  { label: "Vệ sinh khép kín", value: "toilet" },
  { label: "Giờ giấc tự do", value: "time" },
  { label: "Có chỗ để xe", value: "parking" },
  { label: "An ninh tốt", value: "security" },
  { label: "Không chung chủ", value: "owner" },
  { label: "Kệ bếp", value: "kitchen" },
]);

// Bản đồ
const mapAddress = ref("");
const addressTimer = ref(null);
const displayMapAddress = computed(() => mapAddress.value.trim() || "VNUA");

watch(
  () => formData.criteria.address,
  (newAddress) => {
    if (addressTimer.value) clearTimeout(addressTimer.value);
    addressTimer.value = setTimeout(() => {
      mapAddress.value = newAddress;
    }, 1000);
  }
);

// Computed property hiển thị Hình thức
const displayMotel = computed(() => {
  if (formData.criteria.motel === "PHONG_TRO") return "Tìm phòng trọ";
  if (formData.criteria.motel === "O_GHEP") return "Tìm người ở ghép";
  return formData.criteria.motel;
});

// Computed property hiển thị Giới tính
const displayGender = computed(() => {
  if (formData.criteria.gender === true) return "Nam";
  if (formData.criteria.gender === false) return "Nữ";
  return "Không yêu cầu";
});

// Computed property hiển thị Khu vực
const displayDistrict = computed(() => {
  const district = districtList.value.find(
    (d) => d.id === formData.criteria.idDistrict
  );
  return district ? district.name : "";
});

// Computed property cho trạng thái bài đăng
const displayStatus = computed(() => {
  if (formData.approved === true && formData.notApproved === false) {
    return "Đã duyệt";
  } else if (formData.approved === true && formData.notApproved === true) {
    return "Chờ duyệt";
  } else if (formData.approved === false) {
    return "Bị khóa";
  }
  return "";
});

// Computed property cho hiển thị: nếu del=false: "Hiển thị", nếu del=true: "Bị ẩn"
const displayVisibility = computed(() => (formData.del ? "Bị ẩn" : "Hiển thị"));

// Computed property định nghĩa màu chữ cho Hình thức
const motelColor = computed(() => {
  if (formData.criteria.motel === "PHONG_TRO") return "text-green-500";
  if (formData.criteria.motel === "O_GHEP") return "text-red-500";
  return "";
});

// Computed property định nghĩa màu cho Trạng thái (Tag của antd)
const tagStatusColor = computed(() => {
  if (displayStatus.value === "Đã duyệt") return "green";
  if (displayStatus.value === "Chờ duyệt") return "gold";
  if (displayStatus.value === "Bị khóa") return "red";
  return "";
});

// Computed property định nghĩa màu cho Hiển thị (Tag của antd)
const tagVisibilityColor = computed(() => {
  if (displayVisibility.value === "Hiển thị") return "green";
  if (displayVisibility.value === "Bị ẩn") return "red";
  return "";
});

// Hàm tải tài liệu đã được cập nhật để sử dụng API downloadDoc
async function handleDocumentClick(doc) {
  try {
    console.log("💾 Tải tài liệu:", doc.file_name);
    console.log("🆔 Document ID:", doc.id);

    // Gọi API downloadDoc thay vì fetch trực tiếp
    const response = await downloadDoc(doc.id);

    console.log("📡 Response:", response);
    console.log("📡 Response type:", typeof response);
    console.log("📡 Is Blob:", response instanceof Blob);

    let blob;
    let downloadFileName = doc.fileName; // Fallback filename

    // Kiểm tra nếu response là Blob trực tiếp
    if (response instanceof Blob) {
      blob = response;
      console.log(
        "📦 Direct blob - size:",
        blob.size,
        "bytes, type:",
        blob.type
      );
    } else if (response.data) {
      // Nếu response có structure thông thường
      console.log("📡 Response headers:", response.headers);

      // Lấy filename từ Content-Disposition header nếu có
      if (response.headers && response.headers["content-disposition"]) {
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          downloadFileName = fileNameMatch[1].replace(/['"]/g, "");
          console.log("📝 Filename từ header:", downloadFileName);
        }
      }

      // Kiểm tra xem response.data có hợp lệ không
      if (!response.data) {
        throw new Error("API không trả về dữ liệu file");
      }

      // Tạo blob từ response data
      blob = new Blob([response.data]);
    } else {
      throw new Error("Response format không được hỗ trợ");
    }

    console.log("📦 Final blob size:", blob.size, "bytes");
    console.log("📝 Download filename:", downloadFileName);

    if (blob.size === 0) {
      throw new Error("File rỗng");
    }

    // Tạo URL tạm từ blob và tải về
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName; // ⭐ Quan trọng: download attribute
    link.style.display = "none"; // Ẩn link

    // Thêm vào DOM, click, rồi xóa ngay
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup URL sau 1 giây
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      console.log("🗑️ Cleaned up blob URL");
    }, 1000);

    message.success(
      `Đã tải về: ${downloadFileName} (${(blob.size / 1024 / 1024).toFixed(
        1
      )}MB)`
    );
  } catch (error) {
    console.error("❌ Lỗi tải file:", error);
    message.error(`Không thể tải file: ${error.message}`);
  }
}

function getFileTypeText(fileTypeOrName) {
  if (typeof fileTypeOrName === "string") {
    const lower = fileTypeOrName.toLowerCase();
    if (lower.includes("pdf")) return "PDF Document";
    if (lower.includes("word")) return "Word Document";
    if (lower.includes("presentation")) return "PowerPoint";
    if (lower.includes("spreadsheet")) return "Excel";
    if (lower.includes("x-zip-compressed")) return "Zip";
  }
  return "Document";
}
// Hàm duyệt bài
const handleApprove = async () => {
  try {
    await approvePost(props.postId, true);
    message.success("Bài đăng đã được duyệt");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi duyệt bài:", error);
    message.error("Lỗi duyệt bài");
  }
};

// Hàm khóa bài
const handleBlock = async () => {
  try {
    await approvePost(props.postId, false);
    message.success("Bài đăng đã bị khóa");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi khóa bài:", error);
    message.error("Lỗi khóa bài");
  }
};

// Hàm lấy chi tiết bài đăng
const fetchPostDetails = async (id) => {
  try {
    const response = await getDetailPost(id);
    const data = response.data || {};
    formData.title = data.title || "";
    formData.content = data.content || "";
    formData.approved = data.approved ?? false;
    formData.notApproved = data.notApproved ?? false;
    formData.del = data.del ?? false;
    if (data.criteriaDTO) {
      Object.assign(formData.criteria, data.criteriaDTO);
      if (data.criteriaDTO.district && data.criteriaDTO.district.id) {
        formData.criteria.idDistrict = data.criteriaDTO.district.id;
      }
    }
    // Nếu API trả về mảng hình ảnh thì cập nhật lại galleryImages
    if (data.imageStrings) {
      galleryImages.value = data.imageStrings;
      // Reset currentImageIndex về 0 nếu cần
      currentImageIndex.value = 0;
    }
    documents.value = data.documents || [];
  } catch (error) {
    console.error("Lỗi tải thông tin bài đăng:", error);
    message.error("Không thể tải thông tin bài đăng.");
  }
};

onMounted(() => {
  if (props.postId) {
    fetchPostDetails(props.postId);
  }
});

watch(
  () => props.postId,
  (newPostId, oldPostId) => {
    if (newPostId && newPostId !== oldPostId) {
      fetchPostDetails(newPostId);
    }
  }
);

const handleClose = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.submit-btn:hover {
  background-color: #2980b9;
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
