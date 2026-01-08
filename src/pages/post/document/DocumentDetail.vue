<template>
  <a-modal
    v-model:open="modalVisible"
    :footer="null"
    @cancel="handleClose"
    width="800px"
  >
    <div class="create-post space-y-4">
      <!-- Tiêu đề tài liệu -->
      <div class="block flex items-center justify-center">
        <span class="font-bold text-4xl text-gray-800">Chi tiết tài liệu</span>
      </div>

      <!-- Thông tin Hình thức -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Hình thức</span>
        </div>
        

        <!-- Phân loại -->
        <div class="py-2">
          <label>Loại tài liệu</label>
          <div class="flex rounded-lg mt-1 p-2">
            <span class="font-bold">{{
              formData.criteria.secondMotel
            }}</span>
          </div>
        </div>

        <!-- Chuyên ngành -->
          <div class="py-2">
          <label>Chuyên ngành</label>
          <div class="flex rounded-lg mt-1 p-2">
            <span class="font-bold">{{
              formData.criteria.major
            }}</span>
          </div>
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

      <!-- Thông tin mô tả tài liệu -->
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
import { getDetailPost, approvePost } from "@/apis/postService.js";
import { downloadDoc } from "@/apis/documentService.js";

// Danh sách tài liệu đính kèm
const documents = ref([]);

// Props và emit từ component cha
const props = defineProps({
  open: { type: Boolean, default: false },
  postId: { type: [String, Number], default: "" },
});
const emit = defineEmits(["update:open"]);

// Điều khiển modal hiển thị/ẩn
const modalVisible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Danh sách hình ảnh hiển thị
const galleryImages = ref([]);

// Điều khiển chuyển ảnh
const currentImageIndex = ref(0);

// Chuyển sang ảnh tiếp theo
const nextImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % galleryImages.value.length;
  }
};

// Quay lại ảnh trước đó
const prevImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) %
      galleryImages.value.length;
  }
};

// Dữ liệu chi tiết tài liệu
const formData = reactive({
  title: "",
  content: "",
  approved: false,
  notApproved: false,
  del: false,
  criteria: {
    motel: "",
    secondMotel: "",
    address: "",
    idDistrict: "",
    openHours: "",
    airConditioner: false,
    linkShopeeFood: "",
    internet: false,
    delivery: false,
    parking: false,
    dineIn: false,
    takeAway: false,
    bigSpace: false,
    major: "",
  },
});

// Hiển thị trạng thái tài liệu
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

// Màu hiển thị cho tag trạng thái
const tagStatusColor = computed(() => {
  if (displayStatus.value === "Đã duyệt") return "green";
  if (displayStatus.value === "Chờ duyệt") return "gold";
  if (displayStatus.value === "Bị khóa") return "red";
  return "";
});

// Xử lý tải tài liệu về máy
async function handleDocumentClick(doc) {
  try {
    const response = await downloadDoc(doc.id);

    let blob;
    let downloadFileName = doc.fileName;

    // Xử lý response từ API
    if (response instanceof Blob) {
      blob = response;
    } else if (response.data) {
      // Lấy tên file từ header nếu có
      if (response.headers && response.headers["content-disposition"]) {
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['^"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          downloadFileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }

      if (!response.data) {
        throw new Error("API không trả về dữ liệu file");
      }

      blob = new Blob([response.data]);
    } else {
      throw new Error("Response format không được hỗ trợ");
    }

    if (blob.size === 0) {
      throw new Error("File rỗng");
    }

    // Tạo link tải file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Xóa URL tạm sau 1 giây
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    message.success(
      `Đã tải về: ${downloadFileName} (${(blob.size / 1024 / 1024).toFixed(
        1
      )}MB)`
    );
  } catch (error) {
    console.error("Lỗi tải file:", error);
    message.error(`Không thể tải file: ${error.message}`);
  }
}

// Lấy tên loại file từ file type hoặc tên file
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

// Duyệt tài liệu
const handleApprove = async () => {
  try {
    await approvePost(props.postId, true);
    message.success("tài liệu đã được duyệt");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi duyệt bài:", error);
    message.error("Lỗi duyệt bài");
  }
};

// Khóa tài liệu
const handleBlock = async () => {
  try {
    await approvePost(props.postId, false);
    message.success("tài liệu đã bị khóa");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi khóa bài:", error);
    message.error("Lỗi khóa bài");
  }
};

// Lấy thông tin chi tiết tài liệu từ API
const fetchPostDetails = async (id) => {
  try {
    const response = await getDetailPost(id);
    const data = response.data || {};
    
    // Cập nhật thông tin cơ bản
    formData.title = data.title || "";
    formData.content = data.content || "";
    formData.approved = data.approved ?? false;
    formData.notApproved = data.notApproved ?? false;
    formData.del = data.del ?? false;
    
    // Cập nhật thông tin chi tiết
    if (data.criteriaDTO) {
      Object.assign(formData.criteria, data.criteriaDTO);
      if (data.criteriaDTO.district && data.criteriaDTO.district.id) {
        formData.criteria.idDistrict = data.criteriaDTO.district.id;
      }
    }
    
    // Cập nhật hình ảnh
    if (data.imageStrings) {
      galleryImages.value = data.imageStrings;
      currentImageIndex.value = 0;
    }
    
    documents.value = data.documents || [];
  } catch (error) {
    console.error("Lỗi tải thông tin tài liệu:", error);
    message.error("Không thể tải thông tin tài liệu.");
  }
};

// Khởi tạo component
onMounted(() => {
  if (props.postId) {
    fetchPostDetails(props.postId);
  }
});

// Theo dõi thay đổi postId
watch(
  () => props.postId,
  (newPostId, oldPostId) => {
    if (newPostId && newPostId !== oldPostId) {
      fetchPostDetails(newPostId);
    }
  }
);

// Đóng modal
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
