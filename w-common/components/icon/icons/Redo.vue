<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M36.728 36.728A17.943 17.943 0 0 1 24 42c-9.941 0-18-8.059-18-18S14.059 6 24 6c4.97 0 9.47 2.015 12.728 5.272C38.386 12.93 42 17 42 17"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M42 8v9h-9"
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
