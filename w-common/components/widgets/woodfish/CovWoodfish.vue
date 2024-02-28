<template>
    <div
      :style="{
        width: width + 'px',
        height: height + 'px',
      }"
      class="card w-full h-full p-4 flex justify-center items-center  overflow-hidden relative"
    >
      <img
      draggable="false"
        src="../../../assets/images/muyu2.png"
        class="w-20 h-20"
      />
    </div>
  </template>
  
  <script setup lang="ts">
defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});
  </script>
  <style scoped>
  .card {
    /* background: linear-gradient(135deg,#eacda3,#d6ae7b); */
    /* background: radial-gradient(circle at center, #ffdaaa 0%, #ffcf94 100%); */
    background: radial-gradient(circle at center, #3a475f 0%, #161a1f 100%);
  }
  </style>