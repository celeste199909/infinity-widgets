<template>
  <div
    :style="{
      width: widgetData.position.w + 'px',
      height: widgetData.position.h + 'px',
    }"
    class="w-full h-full p-4 flex justify-center items-center bg-black overflow-hidden relative"
    @click="handleClick"
  >
    <div
      v-if="!disabledFn"
      class="text top-10 right-1/2 translate-x-1/2 text-white opacity-0 absolute z-10"
      ref="text"
    >
      功德+1
    </div>
    <img
      src="../../../assets/images/muyu.png"
      class="muyu h-full aspect-square"
      alt=""
      srcset=""
      ref="muyu"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import knockSound from "../../../assets/sounds/knock.wav";
const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  disabledFn: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const muyu = ref<HTMLElement | null>(null);
const text = ref<HTMLElement | null>(null);

function handleClick() {
  if (muyu.value) {
    muyu.value.classList.add("muyu-beat");
    text.value?.classList.add("text-beat");
    const audio = new Audio(knockSound);
    audio.play();
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
