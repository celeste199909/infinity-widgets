<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M12 39h32V7H12v8"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M8 39h24V15H8v8"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M20 23H4v16h16V23Z"
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
