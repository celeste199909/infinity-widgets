<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="wukong-card group relative font-serif p-[10px] w-full h-full overflow-y-scroll rounded-xl flex flex-col justify-center items-center text-white gap-y-[1px]"
  >
    <!-- 内容 -->
    <div class="flex flex-col justify-center items-center gap-y-1">
      <img src="../../../assets/images/wukong_logo_a.png" />
      <div class="flex flex-row justify-center items-center">
        <span
          class="text-[16px] bg-gradient-to-r from-[#AA8E6A] to-[#E7CEAD] font-bold bg-clip-text text-transparent"
          >还有</span
        >
        <span
          class="text-4xl mx-1 mb-1 bg-gradient-to-r from-[#AA8E6A] to-[#E7CEAD] font-bold bg-clip-text text-transparent"
          >{{ daysUntilTargetDate }}</span
        >
        <span
          class="text-[16px] bg-gradient-to-r from-[#AA8E6A] to-[#E7CEAD] font-bold bg-clip-text text-transparent"
          >天</span
        >
      </div>
    </div>
    <!-- 按钮 -->
    <div
      class="absolute right-3 top-3 cursor-pointer transition hidden group-hover:block"
      @click="handleShowWindow"
    >
      <Icon name="picture" color="#e6e6e6" class="w-5 h-5" />
    </div>
    <!-- 壁纸窗口 -->
    <Teleport to="body">
      <CustomWindow
        v-if="isShowWindow"
        :widgetData="widgetData"
        :showTitle="true"
        :name="'壁纸'"
        :winId="'custom-win-' + widgetData.id"
        :width="width"
        :height="height"
        :maxminze="false"
        :resize="false"
        :closeFunction="closeWallpapersWindow"
        :btnColor="'#ffffff'"
      >
        <div class="w-full h-full transition-all duration-300 window-wrapper">
          <!-- 滤镜层 -->
          <div
            class="w-full h-full backdrop-blur-md p-4 px-6 pt-14 flex flex-col justify-center gap-y-3 items-center"
          >
            <!-- 容器 -->
            <div
              ref="wallpapersWrapper"
              class="w-full overflow-hidden rounded-md relative"
            >
              <!-- 操作 -->
              <div
                class="z-10 absolute right-4 bottom-6 flex flex-row justify-center items-center gap-x-2"
                @click="downloadWallpaper"
              >
                <!-- 序号指示器 -->
                <div class="text-white p-2 flex justify-center items-center">
                  {{ curWallpaperIndex + 1 }} / {{ wallpapers.length }}
                </div>
                <!-- 下载按钮 -->
                <div
                  class="w-10 h-10 hover:bg-white/20 rounded-md p-2 flex justify-center items-center gap-x-2 overflow-hidden"
                  @click="downloadWallpaper"
                >
                  <Icon name="download" color="#ffffff" class="w-6 h-6" />
                </div>
              </div>
              <!-- 长页面 -->
              <div
                id="long-page"
                class="h-full w-fit flex flex-row items-center"
              >
                <!-- 单个页面 -->
                <div
                  class="flex flex-row items-center justify-center"
                  v-for="(item, index) in wallpapers"
                  :style="{
                    width: width + 'px',
                    height: height + 'px',
                  }"
                >
                  <img
                    :id="'wallpaper_' + item.id"
                    class="w-full"
                    loading="lazy"
                    :src="item.url"
                  />
                </div>
              </div>
            </div>
            <!-- 预览指示器 -->
            <div
              class="w-full h-28 flex justify-center items-center py-2 gap-2 relative"
            >
              <!-- 说明 -->
              <div class="absolute left-0 top-2 text-[10px] text-slate-300">
                <div>说明：图片来自黑神话官网直接链接</div>
                <div>需要下载更多壁纸或视频壁纸可以前往官网 </div>
                <div>官网：heishenhua.com</div>
              </div>
              <!-- 预览指示器 -->
              <!-- 上一张 -->
              <div
                class="w-28 aspect-video rounded-md flex p-1 flex-row justify-center items-center cursor-pointer overflow-hidden relative"
                @click="moveToPreWallpaper"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <img
                    draggable="false"
                    class="h-full max-w-none"
                    :src="
                      wallpapers[curWallpaperIndex - 1]?.previewUrl ||
                      wallpapers[wallpapers.length - 1].previewUrl
                    "
                  />
                </div>
              </div>
              <!-- 当前张 -->
              <div
                class="w-28 border-2 border-slate-300 aspect-video rounded-md flex p-1 flex-row justify-center items-center cursor-pointer overflow-hidden relative"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <img
                    draggable="false"
                    class="h-full max-w-none"
                    :src="wallpapers[curWallpaperIndex].previewUrl"
                  />
                </div>
              </div>
              <!-- 下一张 -->
              <div
                class="w-28 aspect-video rounded-md flex p-1 flex-row justify-center items-center cursor-pointer overflow-hidden relative"
                @click="moveToNextWallpaper"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <img
                    draggable="false"
                    class="h-full max-w-none"
                    :src="
                      wallpapers[curWallpaperIndex + 1]?.previewUrl ||
                      wallpapers[0].previewUrl
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomWindow>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import Icon from "../../../../w-common/components/icon/Icon.vue";
import CustomWindow from "../../../../w-common/components/CustomWindow.vue";
import { useLayout } from "../../../composables/useLayout";
import { wallpapersData } from "./wallpapersData";

const { layout } = useLayout();

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  modifyWidgetData: {
    type: Function,
    required: false,
  },
});

const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});


const wallpapers = ref(wallpapersData);
const curWallpaperIndex = ref(0);

const wallpapersWrapper = ref();

const width = ref(1000);
const height = ref(650);

function moveToPage() {
  const index = curWallpaperIndex.value;
  const longPage = document.getElementById("long-page");
  if (longPage) {
    longPage.style.transform = `translateX(-${index * width.value}px)`;
  }
}

function moveToPreWallpaper() {
  if (curWallpaperIndex.value === 0) {
    curWallpaperIndex.value = wallpapers.value.length - 1;
  } else {
    curWallpaperIndex.value -= 1;
  }
  moveToPage();
}

function moveToNextWallpaper() {
  if (curWallpaperIndex.value === wallpapers.value.length - 1) {
    curWallpaperIndex.value = 0;
  } else {
    curWallpaperIndex.value += 1;
  }
  moveToPage();
}

function getDaysUntilTargetDate(targetDate: Date): number {
  const currentDate = new Date();
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
}

const targetDate = new Date("2024-08-20");
const daysUntilTargetDate = getDaysUntilTargetDate(targetDate);

const isShowWindow = ref(false);

function handleShowWindow() {
  if(!isShowWindow.value && !isOnEdit.value) {
    isShowWindow.value = true;
  }
}

async function downloadWallpaper() {
  // const wallpaper = wallpapers.value[curWallpaperIndex.value];
  // utools.shellOpenExternal(wallpaper.url);
  const imageUrl = wallpapers.value[curWallpaperIndex.value].url;
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const wallpaperId = wallpapers.value[curWallpaperIndex.value].id;
    link.download = `heishenhua_${wallpaperId}.jpg`;

    // Append the <a> element to the DOM
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}


function closeWallpapersWindow() {
  isShowWindow.value = false;
}

function maxminzeWallpapersWindow() {
  width.value = layout.value.width;
  height.value = layout.value.height;
}
</script>
<style scoped>
.wukong-card {
  background: radial-gradient(circle at center, #3a475f 0%, #161a1f 100%);
}

.window-wrapper {
  background: radial-gradient(circle at center, #3a475f 0%, #161a1f 100%);
}

#long-page {
  transition: transform 0.3s;
}
</style>
