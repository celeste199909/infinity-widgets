import { createApp } from 'vue'
import "../w-common/style.css";
import App from './App.vue'

import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const app = createApp(App)
app.use(Vue3DraggableResizable)
app.mount('#app');

