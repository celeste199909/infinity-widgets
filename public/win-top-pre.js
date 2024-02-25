const { ipcRenderer } = require("electron");
require("./functions/getIcons.js");

window.winTop = {}

let mainWindowId = ""

// 初始化窗口
ipcRenderer.on("init", (payload) => {
    console.log("init", payload);
    mainWindowId = payload.senderId;
});

ipcRenderer.on("addWidget", (e, widget) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('addWidgetEvent', {
        detail: { key: widget },
    });
    document.dispatchEvent(newCustomEvent);
});

ipcRenderer.on("removeAllWidgets", (e) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('removeAllWidgetsEvent');
    document.dispatchEvent(newCustomEvent);
});

// 置顶部分
ipcRenderer.on("addWidgetToTop", (e, widget) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('addWidgetToTopEvent', {
        detail: { widget: widget },
    });
    document.dispatchEvent(newCustomEvent);
});

function addWidgetToOrigin(widget) {
    ipcRenderer.sendTo(mainWindowId, "add-widget-to-origin", widget);
}

window.winTop.addWidgetToOrigin = addWidgetToOrigin