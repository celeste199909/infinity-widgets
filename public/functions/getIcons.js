// desktop.js 提供桌面相关的方法

const { readdir, realpathSync, readFileSync, statSync } = require("fs");
const { ipcRenderer, shell } = require("electron");

window.getIconsByPath = function (path) {
    const iconPath = path;

    return new Promise((resolve, reject) => {
        const desktopIcons = [];

        readdir(iconPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            files.forEach((file) => {
                // 或者快捷方式的真正路径
                const realPath = realpathSync(iconPath + "/" + file);
                // 读取文件
                const res = statSync(realPath)
                // desktop.ini
                if (file === "desktop.ini") return;

                desktopIcons.push({
                    rawName: file,
                    showName: getShowName(file),
                    iconImage: utools.getFileIcon(realPath),
                    realPath: realPath,
                    fromPath: iconPath,
                    isDirectory: res.isDirectory(),
                    isFile: res.isFile(),
                });

            });
            resolve(desktopIcons);
        });
    });
}

// 对展示名称进行处理
function getShowName(rawName) {
    let showName = ""
    // 如果是以点开头的文件名，不做处理
    if (rawName.startsWith(".")) {
      showName = rawName;
    } else {
      showName = rawName.replace(/\.[^/.]+$/, ""); // 去除文件后缀名
    }
    return showName;
  }