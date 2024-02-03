import { createApp } from 'vue'
import "../w-common/style.css";
import App from './App.vue'
import { utools } from "../w-common/plugin/utools";

// utools挂载
window.utools = window.utools || utools;

const app = createApp(App)

app.mount('#app');
