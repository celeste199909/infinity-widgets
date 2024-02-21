<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="relative bg-gradient-to-tr from-[#1b1813] to-[#383126] font-serif p-[10px] w-full h-full overflow-y-scroll rounded-xl flex flex-col justify-center items-center text-white gap-y-[1px]"
  >
    <!-- 内容 -->
    <div class="flex flex-col justify-center items-center gap-y-1">
      <img src="../../../assets/images/wukong_logo_a.png" />
      <div class="flex flex-row justify-center items-center">
        <span class="text-[18px] text-[#E7CEAD]">还有</span>
        <span
          class="text-4xl mx-1 mb-1 bg-gradient-to-r from-[#AA8E6A] to-[#E7CEAD] font-bold bg-clip-text text-transparent"
          >{{ daysUntilTargetDate }}</span
        >
        <span class="text-[18px] text-[#E7CEAD]">天</span>
      </div>
    </div>
    <!-- 按钮 -->
    <div
      class="absolute right-3 top-3 cursor-pointer transition"
      @click="isShowWindow = true"
    >
      <Icon name="picture" color="#e6e6e6" class="w-5 h-5" />
    </div>
    <!-- 壁纸窗口 -->
    <Teleport to="body">
      <CustomWindow
        v-if="isShowWindow"
        :widgetData="widgetData"
        :name="'壁纸'"
        :winId="'custom-win-' + widgetData.id"
        :width="width"
        :height="height"
        :maxminze="false"
        :resize="false"
        :closeFunction="closeWallpapersWindow"
        :maxminzeFunction="maxminzeWallpapersWindow"
        :btnColor="'#ffffff'"
        :showTitle="false"
      >
        <div
          class="w-full h-full"
          :style="{
            backgroundImage:
              'url(https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_035.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }"
        >
          <!-- 滤镜层 -->
          <div
            class="w-full h-full bg-white/20 backdrop-blur-md p-4 flex flex-col justify-between items-center"
          >
            <!-- 容器 -->
            <div
              ref="wallpapersWrapper"
              class="w-full overflow-hidden rounded-md"
            >
              <!-- 长页面 -->
              <div
                id="long-page"
                class="h-full w-fit flex flex-row items-center"
              >
                <!-- 单个页面 -->
                <div
                  class="flex flex-row items-center justify-center"
                  v-for="item in wallpapers"
                  :style="{
                    width: width + 'px',
                    height: height + 'px',
                  }"
                >
                  <img class="w-full" loading="lazy" :src="item.url" />
                </div>
              </div>
            </div>
            <!-- 预览指示器 -->
            <div
              class="w-full h-32 bg-white/20 backdrop-blur-sm flex justify-center py-2 gap-2"
            >
              <div
                v-for="(item, index) in wallpapers"
                class="w-32 aspect-video rounded-md flex flex-row justify-center items-center cursor-pointer hover:bg-slate-200/60 overflow-hidden relative"
                @click="moveToPage(item)"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <img
                    loading="lazy"
                    class="h-full max-w-none"
                    :src="item.previewUrl"
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
import { defineProps, ref, onMounted, Ref, computed, onBeforeMount } from "vue";
import Icon from "../../../../w-common/components/icon/Icon.vue";
import CustomWindow from "../../../../w-common/components/CustomWindow.vue";

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

const wallpapers = ref([
  {
    id: 35,
    name: "壁纸1",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_035.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_035.png",
  },
  {
    id: 36,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_036.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_036.png",
  },
  {
    id: 37,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_037.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_037.png",
  },
  {
    id: 38,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_038.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_038.png",
  },
  {
    id: 39,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_039.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_039.png",
  },
  {
    id: 18,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_018.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_018.png",
  },
  {
    id: 16,
    name: "壁纸2",
    url: "https://www.heishenhua.com/img/Wallpaper/blackmyth_wukong_wallpaper_016.jpg",
    previewUrl:
      "https://www.heishenhua.com/img/thumbnail/Wallpaper/th_pc_blackmyth_wukong_wallpaper_016.png",
  },
]);

const wallpapersWrapper = ref();

const width = ref(900);
const height = ref(600);

function moveToPage(item: any) {
  const index = wallpapers.value.findIndex(
    (wallpaper) => wallpaper.id === item.id
  );
  const longPage = document.getElementById("long-page");
  if (longPage) {
    longPage.style.transform = `translateX(-${index * width.value}px)`;
  }
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

function closeWallpapersWindow() {
  isShowWindow.value = false;
}

function maxminzeWallpapersWindow() {
  // width.value = props.layout.width;
  // height.value = props.layout.height;
}
</script>
<style scoped>
.wukong-card {
}

#long-page {
  transition: transform 0.3s;
}
</style>
