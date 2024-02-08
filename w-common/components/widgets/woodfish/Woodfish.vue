<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="w-full h-full p-4 flex justify-center items-center bg-black overflow-hidden relative"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <img
      src="../../../assets/images/muyu.png"
      class="muyu w-20 h-20 aspect-square"
      draggable="false"
      ref="muyu"
    />
  </div>
  <!-- 有样式 -->
  <div
    v-else
    class="w-full h-full p-4 flex justify-center items-center bg-black overflow-hidden relative"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    @click="handleClick"
  >
    <div
      class="text top-10 right-1/2 translate-x-1/2 text-white opacity-0 absolute z-10"
      ref="text"
    >
      功德+1
    </div>
    <img
      src="../../../assets/images/muyu.png"
      class="muyu h-full aspect-square cursor-pointer"
      draggable="false"
      ref="muyu"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
// import knockSound from "../../../assets/sounds/knock.wav";
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
});

const muyu = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);

function handleClick() {
  if (muyu.value) {
    muyu.value.classList.add("muyu-beat");
    text.value?.classList.add("text-beat");
    // const audio = new Audio(knockSound);
    // audio.play();
    setTimeout(() => {
      muyu.value?.classList.remove("muyu-beat");
      text.value?.classList.remove("text-beat");
    }, 300);
  }
}
</script>
<style scoped>
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
</style>
