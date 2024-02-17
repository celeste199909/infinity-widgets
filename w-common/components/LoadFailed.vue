<template>
  <div
    class="absolute w-full h-full flex flex-col justify-center items-center space-y-3 rounded-xl"
  >
    <div v-if="tooltip" class="text-slate-800">
      {{ tooltip }}
    </div>
    <!-- 重试 -->
    <div
      @click="handleRetry"
      class="flex justify-center items-center overflow-hidden cursor-pointer"
    >
      <Icon class="w-6 h-6" name="redo" :color="btnColor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import Icon from "./icon/Icon.vue";

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
  btnColor: {
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
