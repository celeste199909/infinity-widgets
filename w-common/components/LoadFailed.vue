<template>
  <div
    class="absolute w-full h-full flex flex-col justify-center items-center space-y-3 rounded-xl"
  >
    <div v-if="tooltip" class="text-slate-800">
      {{ tooltip }}
    </div>
    <!-- 重试 -->
    <!-- circle -->
    <div
      v-if="retryBtnStyle === 'circle-white'"
      @click="handleRetry"
      class="flex justify-center items-center overflow-hidden cursor-pointer"
    >
      <img
        class="w-6 h-6"
        src="../assets/icons/retry-96-white.png"
        alt=""
        srcset=""
      />
    </div>
    <div
      v-else-if="retryBtnStyle === 'circle-black'"
      @click="handleRetry"
      class="flex justify-center items-center overflow-hidden cursor-pointer"
    >
      <img
        class="w-6 h-6"
        src="../assets/icons/retry-96-black.png"
        alt=""
        srcset=""
      />
    </div>
    <div v-else class="button cursor-pointer" @click="handleRetry">重试</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
  tooltip: {
    type: String,
    required: false,
    default: "",
  },
  retryFn: {
    type: Function,
    required: true,
  },
  retryBtnStyle: {
    type: String,
    required: false,
    default: "default",
  },
});

function handleRetry() {
  props.retryFn();
  console.log("retry");
}
</script>
<style scoped>
.button {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.8rem 1.2rem;
  background-color: rgb(99 102 241);
  border-radius: 0.375rem;
  border: none;
  outline: none;
}
</style>
