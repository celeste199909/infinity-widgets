const { ipcRenderer } = require("electron");

const preload = {};
let widgetsWrapper = null;

const display = utools.getDisplayNearestPoint({ x: 100, y: 100 })
const { width, height } = display.workAreaSize;

const createWidgetsWrapper = () => {
  widgetsWrapper = utools.createBrowserWindow('./win-widgets/index.html', {
    webPreferences: {
      preload: './win-widgets-pre.js'
    },
    width: width,
    height: height,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    // 不再使用全屏窗口
    fullscreen: false,
    show: true,
    focus: false,
  }, () => {
    // 显示
    // widgetsWrapper.show();
    // widgetsWrapper.webContents.openDevTools();
    ipcRenderer.sendTo(widgetsWrapper.webContents.id, "init");
    utools.showMainWindow();
    // 在窗口失去焦点时将其置于最底层
    widgetsWrapper.on('blur', () => {
      widgetsWrapper.setAlwaysOnTop(true);
      // 发送消息，把右键菜单隐藏
      ipcRenderer.sendTo(widgetsWrapper.webContents.id, "win-blur");
    });

    // 在窗口重新获得焦点时取消置于最底层
    widgetsWrapper.on('focus', () => {
      widgetsWrapper.setAlwaysOnTop(false);  
      // 发送消息，把右键菜单隐藏
      ipcRenderer.sendTo(widgetsWrapper.webContents.id, "win-focus");
    });
  })
}

utools.onPluginEnter(({ code, type, payload, option }) => {
  console.log('用户进入插件应用', code, type, payload)
  const isOnWidgetContainer = utools.dbStorage.getItem('isOnWidgetContainer');
  if (isOnWidgetContainer && !widgetsWrapper) {
    createWidgetsWrapper();
  }
})

// 小组件被点击时，将窗口置于最底层
// ipcRenderer.on("setWindowToBottom", (e, widget) => {
//     widgetsWrapper.blur();
// });

const removeWidgetsWrapper = () => {
  if (widgetsWrapper) {
    widgetsWrapper.close();
    widgetsWrapper = null;
  }
}

const addWidget = (widget) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "addWidget", widget);
}

const removeAllWidgets = () => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "removeAllWidgets");
}

preload.createWidgetsWrapper = createWidgetsWrapper;
preload.removeWidgetsWrapper = removeWidgetsWrapper;
preload.addWidget = addWidget;
preload.removeAllWidgets = removeAllWidgets;

window.preload = preload;
