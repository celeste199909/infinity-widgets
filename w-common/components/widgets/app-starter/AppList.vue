<template>
    <Teleport to="body">
        <div :id="'app-list-' + widgetData.id"
            class="p-3 bg-blue-400 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :style="{
                width: width * 0.6 + 'px',
                height: height * 0.6 + 'px',
            }">
            <div class="py-2 font-bold">启动器</div>
            <div @click="handleClose">关闭</div>
            <div class="w-full h-full flex flex-wrap">
                <div v-for="item in appListData">
                    <img class="icon-image rounded-xl" :id="`icon-image-${item.id}`" :src="item.iconImage" alt="" srcset=""
                        ref="iconImage" />
                    <div class="icon-name">{{ item.showName }}</div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, defineEmits, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    16
);
interface Icon {
    id?: string,
    showName: string,
    fromPath: string,
    iconImage: string,
    isDirectory: boolean,
    isFile: boolean,
    rawName: string,
    realPath: string,
}

const props = defineProps({
    widgetData: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["closeAppList"]);

const width = ref(document.documentElement.clientWidth);
const height = ref(document.documentElement.clientHeight);
const appListData: Ref<Icon[]> = ref([]);

onMounted(async () => {
    const appListId = "app-list-" + props.widgetData.id;
    const appList = document.getElementById(appListId);
    console.log('%c [ appList ]-36', 'font-size:13px; background:pink; color:#bf2c9f;', appList)

    if (appList) {
        gsap.from(`#${appListId}`, {
            duration: 0.3,
            scale: 0,
            ease: "back.out(1.4)",
        });
    }
    const desktopPath = utools.getPath("desktop");
    console.log('%c [ desktopPath ]-43', 'font-size:13px; background:pink; color:#bf2c9f;', desktopPath)
    const result = await window.getIconsByPath(desktopPath) as Icon[];
    console.log('%c [ result ]-44', 'font-size:13px; background:pink; color:#bf2c9f;', result)
    if (result) {
        result.forEach((item: Icon) => {
            item.id = nanoid()
        });
        appListData.value = result as any;
    }

});

function handleClose() {
    const appListId = "app-list-" + props.widgetData.id;
    const appList = document.getElementById(appListId);
    if (appList) {
        gsap.to(`#${appListId}`, {
            duration: 0.2,
            scale: 0,
        });
    }
    setTimeout(() => {
        emit("closeAppList");
    }, 200);
}


</script>
<style scoped></style>