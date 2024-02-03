import { createApp } from 'vue'
import "../w-common/style.css";
import App from './App.vue'
import { utools } from "../w-common/plugin/utools";

import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

// // utools挂载
window.utools = window.utools || utools;

const app = createApp(App)
app.use(Vue3DraggableResizable)
app.mount('#app');

