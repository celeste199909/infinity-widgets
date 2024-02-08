<template>
    <!-- 无样式 -->
    <div v-if="!widgetData.style" class="rounded-xl bg-blue-400 backdrop-blur-sm flex justify-center items-center" :style="{
        width: widgetData.size.w + 'px',
        height: widgetData.size.h + 'px',
    }">
        <img class="w-14 h-14" draggable="false" src="../../../assets/icons/paint-palette-96.png" />
    </div>
    <!-- 有样式 -->
    <div v-else class="rounded-xl bg-blue-500 backdrop-blur-sm flex justify-center items-center" :style="{
        width: widgetData.style[widgetData.currentStyle].w + 'px',
        height: widgetData.style[widgetData.currentStyle].h + 'px',
    }" @click="handleCilck">
        <img class="w-14 h-14" draggable="false" src="../../../assets/icons/paint-palette-96.png" />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
// 组合函数
function handleCilck() {
    // 打开"必应" 并搜索 "uTools"
    utools.ubrowser
        .goto("https://songlh.top/paint-board/")
        .run({ width: 1000, height: 600 });
}
const props = defineProps({
    widgetData: {
        type: Object,
        required: true,
    },
});
</script>
<style scoped>
.widget:hover {
    filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}

.widget:active {
    /* animation: widget-hover 0.6s ease-in-out forwards; */
}

@keyframes widget-hover {
    0% {
        transform: scale(0.98);
    }

    50% {
        transform: scale(1.02);
    }

    100% {
        transform: scale(1);
    }
}
</style>
