const { ipcRenderer } = require("electron");

require("./functions/getIcons.js");
window.winWidget = {}

let mainWindowId = ""

// 初始化窗口
ipcRenderer.on("init", (payload) => {
    console.log("init", payload);
    mainWindowId = payload.senderId;
});

ipcRenderer.on("addWidget", (e, widgetKey) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('addWidgetEvent', {
        detail: { widgetKey: widgetKey },
    });
    document.dispatchEvent(newCustomEvent);
});

ipcRenderer.on("removeAllWidgets", (e) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('removeAllWidgetsEvent');
    document.dispatchEvent(newCustomEvent);
});

// 置顶部分
function addWidgetToTop(widget) {
    ipcRenderer.sendTo(mainWindowId, "add-widget-to-top", widget);
}

ipcRenderer.on("addWidgetToOrigin", (e, widget) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('addWidgetToOrigin', {
        detail: { widget: widget },
    });
    document.dispatchEvent(newCustomEvent);
});

window.winWidget.addWidgetToTop = addWidgetToTop


