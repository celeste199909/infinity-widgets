import { createApp } from 'vue'
import "../w-common/style.css";
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { utools } from "../w-common/plugin/utools";
import Setting from "./pages/Setting.vue";
import WidgetStore from "./pages/WidgetStore.vue"

const routes = [
    { 
        name: 'WidgetStore',
        path: '/', 
        component: WidgetStore
     },
    { 
        name: 'Setting',
        path: '/setting', 
        component: Setting 
    },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
// utools挂载
window.utools = window.utools || utools;

const app = createApp(App)

app.use(router)
app.mount('#app');
