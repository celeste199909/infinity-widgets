<template>
  <div class="p-4 flex flex-col justify-start items-start gap-4">
    <!-- 小组件容器 -->
    <div>
      <div
        class="mt-2 font-bold text-[16px] flex flex-row items-center gap-x-4"
      >
        <div>小组件容器</div>
        <Toggle
          :name="'widgetContainer'"
          :isOn="isOnWidgetContainer"
          :turnOn="turnOnWidgetContainer"
          :turnOff="turnOffWidgetContainer"
        />
      </div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        <div>
          开启时创建一个透明窗口用于容纳小组件
        </div>
        <div>
          可随时关闭
        </div>
      </div>
    </div>
    <!-- 置顶容器 -->
    <div>
      <div
        class="mt-2 font-bold text-[16px] flex flex-row items-center gap-x-4"
      >
        <div>置顶功能</div>
        <Toggle
          :name="'topWidgetContainer'"
          :isOn="isOnTopWidgetContainer"
          :turnOn="turnOnTopWidgetContainer"
          :turnOff="turnOffTopWidgetContainer"
        />
      </div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        <div>开启时创建一个透明窗口</div>
        <div>可随时关闭</div>
        <div>置顶的小组件将置于所有窗口之上，除了 uTools</div>
      </div>
    </div>
    <!-- 删除所有组件 -->
    <div>
      <div class="mt-2 font-bold text-[16px]">删除所有组件</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        此操作将删除桌面上的所有小组件，包括其运行产生的数据。
      </div>
      <button
        @click="removeAllWidgets"
        class="inline-flex select-none cursor-pointer items-center px-4 py-2 bg-red-400 transition ease-in-out delay-75 hover:bg-red-500 text-white text-sm font-medium rounded-md"
      >
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          class="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
        删除
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toggle from "../../w-common/components/Toggle.vue";
const props = defineProps({
  isOnWidgetContainer: {
    type: Boolean,
    required: true,
  },
  turnOnWidgetContainer: {
    type: Function,
    required: true,
  },
  turnOffWidgetContainer: {
    type: Function,
    required: true,
  },
  isOnTopWidgetContainer: {
    type: Boolean,
    required: true,
  },
  turnOnTopWidgetContainer: {
    type: Function,
    required: true,
  },
  turnOffTopWidgetContainer: {
    type: Function,
    required: true,
  },
});

function removeAllWidgets() {
  //   utools.dbStorage.setItem("showWidgets", []);
  window.preload.removeAllWidgets();
}
</script>
<style scoped>
.container > div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.container div {
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
}

.container div div {
  position: absolute;
  left: -9999px;
}

.container div.current + span {
  background-color: #8f8ffc;
  color: white;
}

.container div.current + span:before {
  box-shadow: inset 0 0 0 0.4375em #575793;
}

.container span {
  display: flex;
  align-items: center;
  padding: 0.375em 0.75em 0.375em 0.375em;
  border-radius: 99em;
  transition: 0.25s ease;
  color: #8282ff;
}

.container span:hover {
  background-color: #d6d6e5be;
}
.dark .container span:hover {
  background-color: #51516b;
}

.container span:before {
  display: flex;
  flex-shrink: 0;
  content: "";
  background-color: #fff;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-right: 0.375em;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 0.125em #2e2e60;
}
</style>
