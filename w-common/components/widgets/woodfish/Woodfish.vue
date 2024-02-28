<template>
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="card w-full h-full p-10 flex justify-center items-center overflow-hidden relative"
  >
    <div
      class="text top-10 right-1/2 translate-x-1/2 text-slate-300 opacity-0 absolute z-10"
      ref="text"
    >
      {{ selectedOption }} +1
    </div>
    <img
      draggable="false"
      src="../../../assets/images/muyu2.png"
      class="muyu h-full aspect-square cursor-pointer"
      ref="muyu"
      @click="handleClick"
    />
    <div
      class="text bottom-2 left-2 text-slate-400 text-[12px] absolute z-10 cursor-pointer"
      @click="handleShowSetting"
    >
      {{ selectedOption }} +{{ count }}
    </div>
    <!-- 设置 -->
    <Teleport to="body">
      <CustomWindow
        v-if="isShowSetting"
        :widgetData="widgetData"
        :name="'设置'"
        :winId="'custom-win-' + widgetData.id"
        :width="400"
        :height="300"
        :maxminze="false"
        :closeFunction="closeSetting"
        :btnColor="'#666'"
        :showTitle="false"
      >
        <div
          class="window-content bg-slate-100 text-slate-600 p-8 pt-14 w-full h-full relative flex flex-col gap-y-4"
        >
          <div class="flex flex-row items-center gap-x-4">
            <div class="font-bold text-slate-600">声音</div>
            <Toggle
              :name="'audio-setting'"
              :isOn="isOnAudio"
              :turnOn="turnOnAudio"
              :turnOff="turnOffAudio"
            />
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="font-bold text-slate-600">+1文字</div>
            <select
              class="select select-primary w-32 select-sm"
              v-model="selectedOption"
              @change="handleOptionChange"
            >
              <option disabled selected>+1文字</option>
              <option class="text-slate-800">功德</option>
              <option class="text-slate-800">财富</option>
              <option class="text-slate-800">好运</option>
              <option class="text-slate-800">健康</option>
            </select>
          </div>
        </div>
      </CustomWindow>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import knockSound from "../../../assets/sounds/knocking-on-a-bottle.wav";
import CustomWindow from "../../CustomWindow.vue";
import Toggle from "../../Toggle.vue";
import { watchDeep } from "@vueuse/core";

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

const muyu = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);

const count = ref(props.widgetData.data.count || 0);

watchDeep(count, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.count = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

function handleClick() {
  if (isOnEdit.value) return;
  if (muyu.value) {
    muyu.value.classList.add("muyu-beat");
    text.value?.classList.add("text-beat");
    count.value++;
    if (isOnAudio.value) {
      const audio = new Audio(knockSound);
      audio.play();
    }
    setTimeout(() => {
      muyu.value?.classList.remove("muyu-beat");
      text.value?.classList.remove("text-beat");
    }, 300);
  }
}

// 声音
const isOnAudio = ref(props.widgetData.data.isOnAudio || false);
watchDeep(isOnAudio, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.isOnAudio = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

function turnOnAudio() {
  isOnAudio.value = !isOnAudio.value;
}

function turnOffAudio() {
  if (isOnEdit.value) return;
  isOnAudio.value = false;
}
// 设置
const isShowSetting = ref(false);
function closeSetting() {
  if (isOnEdit.value) return;
  isShowSetting.value = false;
}

function handleShowSetting() {
  if (isOnEdit.value) return;
  isShowSetting.value = true;
}

// 文字
const selectedOption = ref("功德");
watchDeep(selectedOption, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.selectedOption = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

function handleOptionChange() {
  count.value = 0;
}
</script>
<style scoped>
.card {
  /* background: linear-gradient(135deg,#eacda3,#d6ae7b); */
  /* background: radial-gradient(circle at center, #ffdaaa 0%, #ffcf94 100%); */
  background: radial-gradient(circle at center, #3a475f 0%, #161a1f 100%);
}
.muyu-beat {
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
  cursor: pointer;
  animation: muyu-beat 0.4s infinite;
}

@keyframes muyu-beat {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.text-beat {
  animation: text-beat 0.4s infinite;
}

@keyframes text-beat {
  0% {
    opacity: 1;
    top: 20px;
  }

  100% {
    opacity: 0;
    top: -20px;
  }
}

.window-content {
  display: flex;
  flex-direction: column;
  /* background: #606c88;
  background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
  background: linear-gradient(to right, #3f4c6b, #606c88); */
  border-radius: 10px;
  /* background-color: white; */
}
</style>
