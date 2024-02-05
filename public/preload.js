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
    widgetsWrapper.webContents.openDevTools();
    ipcRenderer.sendTo(widgetsWrapper.webContents.id, "init");
    utools.showMainWindow();
  })
}

utools.onPluginEnter(({code, type, payload, option}) => {
  console.log('用户进入插件应用', code, type, payload)
  if(!widgetsWrapper) {
    createWidgetsWrapper();
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

const removeWidget = (widget) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "removeWidget", widget);
}

const setEditMode = (editMode) => {
  ipcRenderer.sendTo(widgetsWrapper.webContents.id, "setEditMode", editMode);
}

preload.createWidgetsWrapper = createWidgetsWrapper;
preload.removeWidgetsWrapper = removeWidgetsWrapper;
preload.addWidget = addWidget;
preload.removeWidget = removeWidget;
preload.setEditMode = setEditMode;

window.preload = preload;
