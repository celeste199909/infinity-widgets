<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M7 42h36"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M11 26.72V34h7.317L39 13.308 31.695 6 11 26.72Z"
      data-follow-stroke="#333"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "#666",
  },
  width: {
    type: Number,
    default: 2,
  },
});
</script>

<style scoped></style>
