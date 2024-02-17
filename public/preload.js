const { ipcRenderer } = require("electron");

const preload = {};
let widgetsWrapper = null;

const createWidgetsWrapper = () => {
  widgetsWrapper = utools.createBrowserWindow('./win-widgets/index.html', {
    webPreferences: {
      preload: './win-widgets-pre.js'
    },
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    fullscreen: true,
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
  if (isOnWidgetContainer) {
    createWidgetsWrapper();
  }else{
    // utools.showNotification('请先开启容小组件容器');
  }
})

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
