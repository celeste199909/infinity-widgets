<template>
    <!-- 无样式 -->
    <div v-if="!widgetData.style"
        class="rounded-xl w-full h-full p-4 flex justify-center items-center bg-sky-200 overflow-hidden relative" :style="{
            width: widgetData.size.w + 'px',
            height: widgetData.size.h + 'px',
        }">
        <img class="w-18 h-18" draggable="false" src="../../../assets/icons/start-48.png" />
    </div>
    <!-- 有样式 -->
    <div v-else class="rounded-xl w-full h-full p-4 flex justify-center items-center bg-sky-200 overflow-hidden relative"
        :style="{
            width: widgetData.style[widgetData.currentStyle].w + 'px',
            height: widgetData.style[widgetData.currentStyle].h + 'px',
        }" @click="handleToggleAppList">
        <img class="w-14 h-14" draggable="false" src="../../../assets/icons/start-48.png" />
    </div>
    <!-- AppList -->
    <AppList class="z-20" :widgetData="widgetData" v-if="isShowAppList" @closeAppList="handleCloseAppList" />
</template>
  
<script setup lang="ts">
import { defineProps, ref } from "vue";
import AppList from "./AppList.vue";
import { gsap } from "gsap";

const props = defineProps({
    widgetData: {
        type: Object,
        required: true,
    },
});

const isShowAppList = ref(false);

function handleToggleAppList() {
    if (isShowAppList.value) {
        const appListId = "app-list-" + props.widgetData.id;
        const appList = document.getElementById(appListId);
        if (appList) {
            gsap.to(`#${appListId}`, {
                duration: 0.2,
                scale: 0,
            });
        }
        setTimeout(() => {
            isShowAppList.value = false;
        }, 200);
    }else {
        isShowAppList.value = true;
    }
}

function handleCloseAppList() {
    isShowAppList.value = false;
}
</script>
<style scoped></style>
  