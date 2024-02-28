const { ipcRenderer } = require("electron");

const preload = {};
let widgetsWrapper = null;
let topWidgetsWrapper = null;

const display = utools.getDisplayNearestPoint({ x: 100, y: 100 })
const { width, height } = display.workAreaSize;

const createWidgetsWrapper = () => {
  widgetsWrapper = utools.createBrowserWindow('./win-widgets/index.html', {
    webPreferences: {
      preload: './win-widgets-pre.js'
    },
    width: width,
    height: height,
    // width:900,
    // height: 600,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    // 不再使用全屏窗口
    fullscreen: false,
    show: true,
    focus: false,
  }, () => {
    // 显示
    // widgetsWrapper.webContents.openDevTools();
    ipcRenderer.sendTo(widgetsWrapper.webContents.id, "init");
    utools.showMainWindow();

  })
}

// 创建置顶窗口
const createTopWidgetsWrapper = () => {
  topWidgetsWrapper = utools.createBrowserWindow('./win-top/index.html', {
    webPreferences: {
      preload: './win-top-pre.js'
    },
    width: width,
    height: height,
    // width:900,
    // height: 600,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    // 不再使用全屏窗口
    fullscreen: false,
    show: true,
    focus: false,
  }, () => {
    // 显示
    // topWidgetsWrapper.webContents.openDevTools();
    topWidgetsWrapper.setAlwaysOnTop(true, "screen-saver");
    ipcRenderer.sendTo(topWidgetsWrapper.webContents.id, "init");
    utools.showMainWindow();
  })
}


utools.onPluginEnter(({ code, type, payload, option }) => {
  console.log('用户进入插件应用', code, type, payload)

  const isOnWidgetContainer = utools.dbStorage.getItem('isOnWidgetContainer');
  const isOnTopWidgetContainer = utools.dbStorage.getItem('isOnTopWidgetContainer');
  if (isOnWidgetContainer && !widgetsWrapper) {
    createWidgetsWrapper();
    if (isOnTopWidgetContainer && !topWidgetsWrapper) {
      setTimeout(() => {
        createTopWidgetsWrapper();
      }, 300);
    }
  }
})

const addWidget = (widgetKey) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "addWidget", widgetKey);
}

const removeAllWidgets = () => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "removeAllWidgets");
  setTimeout(() => {
    ipcRenderer.sendTo(topWidgetsWrapper.webContents.id, "removeAllWidgets");
  }, 300);
}

// 移除窗口
const removeWidgetsWrapper = () => {
  if (widgetsWrapper) {
    widgetsWrapper.close();
    widgetsWrapper = null;
  }
}

// 置顶功能
ipcRenderer.on("add-widget-to-top", (e, widget) => {
  ipcRenderer.sendTo(topWidgetsWrapper.webContents.id, "addWidgetToTop", widget);
});
ipcRenderer.on("add-widget-to-origin", (e, widget) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "addWidgetToOrigin", widget);
});

const removeTopWidgetsWrapper = () => {
  if (topWidgetsWrapper) {
    topWidgetsWrapper.close();
    topWidgetsWrapper = null;
  }
}

preload.createWidgetsWrapper = createWidgetsWrapper;
preload.removeWidgetsWrapper = removeWidgetsWrapper;
preload.addWidget = addWidget;
preload.removeAllWidgets = removeAllWidgets;

preload.createTopWidgetsWrapper = createTopWidgetsWrapper;
preload.removeTopWidgetsWrapper = removeTopWidgetsWrapper;


window.preload = preload;
