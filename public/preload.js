const { ipcRenderer } = require("electron");

// const { attach, detach, refresh } = require("electron-as-wallpaper");

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
    alwaysOnTop: true,
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
    ipcRenderer.sendTo(topWidgetsWrapper.webContents.id, "init");
    utools.showMainWindow();
  })
}


utools.onPluginEnter(({ code, type, payload, option }) => {
  console.log('用户进入插件应用', code, type, payload)
  const isOnWidgetContainer = utools.dbStorage.getItem('isOnWidgetContainer');
  if (isOnWidgetContainer && !widgetsWrapper) {
    createWidgetsWrapper();
  }
})

const addWidget = (widget) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "addWidget", widget);
}

const removeAllWidgets = () => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "removeAllWidgets");
}

const removeWidgetsWrapper = () => {
  if (widgetsWrapper) {
    widgetsWrapper.close();
    widgetsWrapper = null;
  }
}

// 置顶功能
// 删除置顶窗口
const removeTopWidgetsWrapper = () => {
  if (topWidgetsWrapper) {
    topWidgetsWrapper.close();
    topWidgetsWrapper = null;
  }
}
// 把组件添加到置顶窗口
const addWidgetToTop = (widget) => {
  if (!topWidgetsWrapper) {
    createTopWidgetsWrapper();
  }
  ipcRenderer.sendTo(topWidgetsWrapper.webContents.id, "addWidget", widget);
}

preload.createWidgetsWrapper = createWidgetsWrapper;
preload.removeWidgetsWrapper = removeWidgetsWrapper;
preload.addWidget = addWidget;
preload.removeAllWidgets = removeAllWidgets;

// 置顶功能
preload.createTopWidgetsWrapper = createTopWidgetsWrapper;
preload.removeTopWidgetsWrapper = removeTopWidgetsWrapper;
preload.addWidgetToTop = addWidgetToTop;

window.preload = preload;
