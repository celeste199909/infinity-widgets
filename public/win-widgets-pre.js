const { ipcRenderer } = require("electron");

require("./functions/getIcons.js");

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

ipcRenderer.on("removeAllWidgets", (e, widget) => {
    // 触发自定义事件，并传递参数
    const newCustomEvent = new CustomEvent('removeAllWidgetsEvent', {
        detail: { key: widget },
    });
    document.dispatchEvent(newCustomEvent);
});

// 监听窗口失去焦点
ipcRenderer.on("win-blur", () => {
    const newCustomEvent = new CustomEvent('winBlurEvent', {
        detail: { key: "value" },
    });
    document.dispatchEvent(newCustomEvent);
});

// 监听窗口重新获得焦点
ipcRenderer.on("win-focus", () => {
    const newCustomEvent = new CustomEvent('winFocusEvent', {
        detail: { key: "value" },
    });
    document.dispatchEvent(newCustomEvent);
});

// 监听窗口置于最底层
// document.addEventListener("widget-on-click", function (event) {
//     console.log('%c [ widget-on-click ]-48', 'font-size:13px; background:pink; color:#bf2c9f;',)
//     ipcRenderer.sendTo(mainWindowId, "setWindowToBottom");
// });

