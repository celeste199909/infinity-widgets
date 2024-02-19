<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M6 42h36V6H30c-1.324 3.159-3.324 4.738-6 4.738S19.324 9.158 18 6H6v36Z"
      clip-rule="evenodd"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="m15 24 6 6 12-12"
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
