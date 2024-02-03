const { ipcRenderer } = require("electron");

// 初始化窗口
ipcRenderer.on("init", () => {
    console.log("init");
});

// 添加自定义事件
// 创建一个自定义事件

const addWidgetEvent = new CustomEvent('addWidgetEvent', { detail: { key: 'value' } });
ipcRenderer.on("addWidget", (e, widget) => {
    // 触发自定义事件
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('addWidgetEvent', {
        detail: { key: widget },
    });
    document.dispatchEvent(newCustomEvent);
});


const removeWidgetEvent = new CustomEvent('removeWidgetEvent', { detail: { key: 'value' } });
ipcRenderer.on("removeWidget", (e, widget) => {
    // 触发自定义事件
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('removeWidgetEvent', {
        detail: { key: widget },
    });
    document.dispatchEvent(newCustomEvent);
});

// 创建一个自定义事件



