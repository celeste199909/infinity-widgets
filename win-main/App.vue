<template>
  <div
    class="w-screen h-screen flex flex-row justify-center text-slate-600 bg-gradient-to-br bg-white dark:bg-[#343434] dark:text-slate-100 overflow-hidden"
  >
    <!-- 左侧导航栏 -->
    <div
      class="w-14 p-2 box-content h-full flex flex-col justify-start gap-2 border-r-2 border-gray-100 dark:border-white/10"
    >
      <!-- 小组件商店 -->
      <router-link
        to="/"
        class="w-14 h-14 p-3 overflow-hidden rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-center items-center"
      >
        <Icon
          name="all-app"
          :width="route.name === 'WidgetStore' ? 4 : 2"
          :color="route.name === 'WidgetStore' ? '#8f8ffc' : '#8080ff'"
        />
      </router-link>
      <!-- 设置 -->
      <router-link
        to="/setting"
        class="w-14 h-14 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-center items-center"
      >
        <Icon
          name="setting"
          :width="route.name === 'Setting' ? 4 : 2"
          :color="route.name === 'Setting' ? '#8f8ffc' : '#8080ff'"
        />
      </router-link>
      <!-- 帮助 -->
      <router-link
        to="/help"
        class="w-14 h-14 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 flex justify-center items-center"
      >
        <Icon
          name="help"
          :width="route.name === 'Help' ? 4 : 2"
          :color="route.name === 'Help' ? '#8f8ffc' : '#8080ff'"
        />
      </router-link>
    </div>
    <!-- 小组件列表 -->
    <div class="flex-1 h-full">
      <router-view :isOnWidgetContainer="isOnWidgetContainer"></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, provide } from "vue";
import Icon from "../w-common/components/icon/Icon.vue";
import { watchDeep } from "@vueuse/core";
import { useRoute } from "vue-router";

const route = useRoute();

const isOnWidgetContainer = ref(
  utools.dbStorage.getItem("isOnWidgetContainer") || false
);
watchDeep(isOnWidgetContainer, (value) => {
  utools.dbStorage.setItem("isOnWidgetContainer", value);
});

function turnOnWidgetContainer() {
  isOnWidgetContainer.value = true;
  window.preload.createWidgetsWrapper();
}

function turnOffWidgetContainer() {
  isOnWidgetContainer.value = false;
  window.preload.removeWidgetsWrapper();
}

provide("isOnWidgetContainer", isOnWidgetContainer);
provide("turnOnWidgetContainer", turnOnWidgetContainer);
provide("turnOffWidgetContainer", turnOffWidgetContainer);

onMounted(() => {
  window.utools.isDarkColors()
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
});
</script>

<style scoped>
.ghost {
  opacity: 0;
}
.dragging {
  opacity: 1;
}
.card {
  transition: all 0.2s;
  position: relative;
}
.card::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: -100%;
  width: 200%;
  height: 20%;
  background: linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  z-index: 1;
  transform: rotate(30deg) translateY(0);
  transform-origin: top right; /* 设置为右上角 */
}

.card:hover::after {
  animation: shine 0.5s linear;
}

@keyframes shine {
  0% {
    transform: rotate(30deg) translateY(0);
  }
  100% {
    transform: rotate(30deg) translateY(1200%);
  }
}

.card:hover {
  transform: scale(1.05);
  border-radius: 12px;
}
</style>
