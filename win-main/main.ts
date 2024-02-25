import { createApp } from 'vue'
import "../w-common/style.css";
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from "./pages/Setting.vue";
import WidgetStore from "./pages/WidgetStore.vue"
import Help from "./pages/Help.vue"

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
    {
        name: 'Help',
        path: '/help',
        component: Help
    },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

const app = createApp(App)

app.use(router)
app.mount('#app');
