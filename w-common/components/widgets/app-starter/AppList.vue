<template>
  <Teleport to="body">
    <CustomWindow
      :name="'应用启动器'"
      :winId="'custom-win-' + widgetData.id"
      :width="1000"
      :height="700"
      :closeFunction="handleClose"
      :maxminzeBtnStyle="'white'"
      :closeBtnStyle="'white'"
    >
      <div
        :id="'app-list-' + widgetData.id"
        class="apps-wrapper p-3 pt-12 w-full h-full overflow-hidden"
      >
        <div
          class="w-fit mx-auto h-full flex flex-row flex-wrap content-start overflow-y-scroll"
        >
          <template v-for="item in appListData">
            <div v-if="!item.isDirectory" class="icon">
              <img
                class="icon-image rounded-xl"
                :id="`icon-image-${item.id}`"
                :src="item.iconImage"
                ref="iconImage"
                @click="openApp(item.realPath)"
              />
              <div class="icon-name text-slate-200">{{ item.showName }}</div>
            </div>
          </template>
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

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["closeAppList"]);

const width = ref(document.documentElement.clientWidth);
const height = ref(document.documentElement.clientHeight);
const appListData: Ref<Icon[]> = ref([]);

onMounted(async () => {
  const desktopPath = utools.getPath("desktop");
  const result = (await window.getIconsByPath(desktopPath)) as Icon[];
  if (result) {
    result.forEach((item: Icon) => {
      item.id = nanoid();
    });
    appListData.value = result as any;
  }
});

function handleClose() {
  emit("closeAppList");
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
</style>
