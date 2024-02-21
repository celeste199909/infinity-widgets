<template>
  <!-- 无样式 -->
  <div
    class="bg-blue-500 text-white p-3 w-full h-full rounded-xl flex flex-col justify-center items-center gap-1"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div class="w-full h-full flex flex-col justify-center items-center">
      <div class="h-14 flex justify-center items-center text-center">
        <Icon name="location" class="w-5 h-5" color="#ffffff" />
        <div> 广东省</div>
      </div>
      <div class="flex justify-center items-center overflow-hidden">
        <img
          draggable="false"
          class="w-full h-full block select-none"
          :src="getLocalImage('cloudy')"
        />
      </div>
      <div
        class="flex-grow-0 h-14 flex flex-row justify-center items-center gap-2"
      >
        <div>23 ℃</div>
        <div>多云</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '../../icon/Icon.vue';
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

function getLocalImage(name: string) {
  return new URL(`/w-common/assets/icons/weather/${name}.svg`, import.meta.url)
    .href;
}
</script>
<style scoped></style>
