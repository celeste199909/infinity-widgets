<template>
  <Teleport to="body">
    <CustomWindow
      :name="'应用启动器'"
      :winId="'custom-win-' + widgetData.id"
      :width="1000"
      :height="700"
      :closeFunction="handleClose"
      :btnColor="'#ffffff'"
    >
      <div
        :id="'app-list-' + widgetData.id"
        class="apps-wrapper p-5 pt-12 w-full h-full overflow-hidden relative  "
      >
        <!-- 图标 -->
        <div
          v-if="!isShowSetting"
          class="w-full h-full flex flex-row flex-wrap overflow-y-scroll place-content-start justify-start items-start"
        >
          <template v-for="item in appListData">
            <div v-if="!item.isDirectory" class="icon ">
              <img
                draggable="false"
                class="icon-image border-white/60 rounded-2xl p-[6px]"
                :id="`icon-image-${item.id}`"
                :src="item.iconImage"
                ref="iconImage"
                @click="openApp(item.realPath)"
              />
              <div class="icon-name text-slate-200">{{ item.showName }}</div>
            </div>
          </template>
        </div>
        <!-- 设置内容 -->
        <div
          v-else
          class="setting-window mt-5 pb-10 text-white min-w-[300px] w-[400px] h-full overflow-y-scroll mx-auto flex flex-col justify-start items-start gap-y-3"
        >
          <div
            class="flex flex-row justify-star items-centert gap-x-2 text-2xl"
          >
            <div class="font-bold">应用的路径</div>
          </div>
          <div class="text-slate-100">
            使用方法：你可以把只用于点击打开的应用放到一个文件夹中，然后再把文件夹的路径设置在这里，这样就不需要在桌面放很多应用的图标了。
          </div>
          <!-- 卡片 -->
          <div
            class="my-2 w-full transition-all flex flex-row gap-x-2 py-4 px-5 justify-start items-center rounded-2xl border-[3px] border-blue-600"
          >
            <!-- 名字和路径 -->
            <div class="flex flex-1 h-18 flex-col gap-y-1">
              <div class="font-bold text-lg">
                {{ appPath.name }}
              </div>
              <div
                class="border-blue-600 hover:border-blue-700 hover:underline cursor-pointer line-clamp-1"
                @click="openPathInExplorer(appPath.path)"
              >
                {{ appPath.path }}
              </div>
            </div>
            <!-- 设置  -->
            <div
              class="w-20 h-14 rounded-xl font-bold flex justify-center items-center hover:bg-slate-600/60 cursor-pointer"
              @click="setAppPath"
            >
              设置
            </div>
          </div>
        </div>
        <!-- 设置按钮 -->
        <div
          class="setting-btn absolute right-4 bottom-4 cursor-pointer"
          @click="toggleShowSetting"
        >
          <span class="bar bar1"></span>
          <span class="bar bar2"></span>
          <span class="bar bar1"></span>
        </div>
      </div>
    </CustomWindow>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, defineEmits, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { customAlphabet } from "nanoid";
import CustomWindow from "../../CustomWindow.vue";
import _ from "lodash";
import { watchDeep } from "@vueuse/core";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  16
);
interface Icon {
  id?: string;
  showName: string;
  fromPath: string;
  iconImage: string;
  isDirectory: boolean;
  isFile: boolean;
  rawName: string;
  realPath: string;
}

interface Path {
  id: string;
  name: string;
  path: string;
}

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

const emit = defineEmits(["closeAppList"]);

const width = ref(document.documentElement.clientWidth);
const height = ref(document.documentElement.clientHeight);
const appListData: Ref<Icon[]> = ref([]);
const isShowSetting = ref(false);

const appPath: Ref<Path> = ref(
  props.widgetData.data.appPath || {
    id: "desktop",
    name: "桌面",
    path: utools.getPath("desktop"),
  }
);

watchDeep(appPath, () => {
  const _widgetData = _.cloneDeep(props.widgetData);
  _widgetData.data.appPath = appPath.value;
  if (props.modifyWidgetData) {
    props.modifyWidgetData(_widgetData);
  }
});

onMounted(async () => {
  loadIcons();
});

async function loadIcons() {
  const result =
    ((await window.getIconsByPath(appPath.value.path)) as Icon[]) || [];
  result.forEach((item: Icon) => {
    item.id = nanoid();
  });
  appListData.value = result as any;
}

function setAppPath() {
  const paths = utools.showOpenDialog({
    properties: ["openDirectory"],
    defaultPath: utools.getPath("desktop"),
  });

  if (!paths) return;

  const path = paths[0];
  const pathName = _.last(path.split("\\"));

  appPath.value = {
    id: nanoid(),
    name: pathName,
    path: path,
  };

  loadIcons();
}

function toggleShowSetting() {
  isShowSetting.value = !isShowSetting.value;
}

function handleClose() {
  emit("closeAppList");
}

function openPathInExplorer(path: string) {
  utools.shellOpenPath(path);
}

function openApp(realPath: string) {
  utools.shellOpenPath(realPath);
  handleClose();
}
</script>
<style scoped>
.apps-wrapper {
  background: radial-gradient(circle at center, #3a475f 0%, #161a1f 100%);
}

.icon {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  border: 2px solid #00000000;
  transition: all 0.3s;
  padding: 10px;
  width: 120px;
  height: 120px;
}

.icon .icon-image {
  width: 50%;
  height: 50%;
  margin: 10px;
}

.icon .icon-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1rem;
}

.icon-image:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
  /* animation: icon-image-hover 0.3s ease-in-out forwards; */
}

.icon-image:active {
  /* filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438)); */
  animation: icon-image-hover 0.6s ease-in-out forwards;
}

@keyframes icon-image-hover {
  0% {
    transform: scale(0.98);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.setting-btn {
  width: 45px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
.bar {
  width: 50%;
  height: 2px;
  background-color: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2px;
}
.bar::before {
  content: "";
  width: 2px;
  height: 2px;
  background-color: rgb(126, 117, 255);
  position: absolute;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.3s;
  box-shadow: 0px 0px 5px white;
}
.bar1::before {
  transform: translateX(-4px);
}
.bar2::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar1::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar2::before {
  transform: translateX(-4px);
}
</style>
