
const { readdir, realpathSync, readdirSync, readFileSync } = require("fs");
const { ipcRenderer, shell } = require("electron");

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 获取steam游戏列表
window.getSteamApps = function (steamRootPath) {
  return new Promise((resolve, reject) => {
    // steam 根目录
    // const steamRootPath = "D:\\Software\\steam";
    // let steamRootPath = utools.dbStorage.getItem('steamRootPath');
    // steamAppsPath = readFileSync(steamRootPath)
    // if (!steamRootPath) {
    //   resolve("未设置steam根目录");
    //   return;
    // }
    // 下载的steam游戏目录
    const steamAppsPath = steamRootPath + "\\steamapps";
    const steamAppsPathFiles = readdirSync(steamAppsPath)
    // 使用 filter 方法筛选出以 "appmanifest_" 开头且以 ".acf" 结尾的元素
    const appmanifestList = steamAppsPathFiles.filter(file => file.startsWith("appmanifest_") && file.endsWith(".acf"));
    const steamAppsData = [];
    // 扫描 D:\Software\steam\appcache\librarycache 目录，找到对应的图片

    const imagePath = steamRootPath + "\\appcache\\librarycache";
    const imageList = readdirSync(imagePath)
    // 开始对每个 .acf 文件进行处理
    appmanifestList.forEach((file) => {
      const fileContent = readFileSync(steamAppsPath + "\\" + file);
      const acfInfo = parseSteamSCFString(fileContent.toString())
      // 获取需要的属性
      const appId = acfInfo.appid;
      // 过滤掉 steam 客户端自带的游戏
      if (Number(appId) === 228980) {
        return;
      }
      // 根据游戏id获取对应的图片
      const searchString = `${appId}_library_600x900`;
      const coverImageName = imageList.find((imageFile) => {
        if (imageFile.includes(searchString)) {
          return true;
        }
      });
      // 遍历目录
      const steamApp = {
        // 自带属性
        appid: acfInfo.appid,
        LauncherPath: acfInfo.LauncherPath,
        name: acfInfo.name,
        installdir: acfInfo.installdir,
        // 增加属性
        gamePath: steamAppsPath + "\\steamapps\\common\\" + acfInfo.installdir,  // 游戏路径
        iconImage: steamRootPath + "\\appcache\\librarycache\\" + acfInfo.appid + "_icon.jpg", // 图标路径
        logoImage: steamRootPath + "\\appcache\\librarycache\\" + acfInfo.appid + "_logo.png", // logo路径
        coverImage: steamRootPath + "\\appcache\\librarycache\\" + coverImageName,
        libraryHeroImage: steamRootPath + "\\appcache\\librarycache\\" + acfInfo.appid + "_library_hero.jpg", // 头图路径
        steamURL: "steam://rungameid/" + acfInfo.appid, // steam url
      }
      // 添加到 steamAppsData 数组
      steamAppsData.push(steamApp)

    });
    // 处理完毕，返回 steamAppsData 数组
    resolve(steamAppsData);
  });
}

// 打开 steam 游戏
window.openSteamApp = function (steamApp) {
  // 构建Steam URL
  const steamURL = steamApp.steamURL;

  // 使用默认的系统命令打开Steam URL
  exec(`start ${steamURL}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${steamApp}`);
      return;
    }
    console.log(`Steam URL opened successfully.`);
  });
}

// 解析 .url 文件内容的函数
function parseUrlFile(fileContent) {
  const urlInfo = {};
  const lines = fileContent.split('\n');

  for (const line of lines) {
    const parts = line.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim().toLowerCase();
      const value = parts[1].trim();
      urlInfo[key] = value;
    }
  }

  return urlInfo;
}

// 解析 .acf 文件内容的函数
function parseSteamSCFString(scfString) {
  // Step 1: 把第一行的 "AppState" 去掉
  const step1 = scfString.replace(/^"AppState"\s*\n?\s*{/i, '{');
  // Step 2: 在每个 { 前面加上冒号，但是第一个 { 前面不加冒号
  const step2 = step1.replace(/\n?\s*{/g, (match, offset) => offset === 0 ? '{' : ': {');
  // Step 3: 把每个键值之间的空白符替换成冒号（假设是两个tab）
  const step3 = step2.replace(/"([^"]+)"\s+"([^"]+)"/g, '"$1": "$2",');
  // Step 4: 在每个 } 后加上一个逗号，除了最后一个 } 后面不加逗号
  const step4 = step3.replace(/}/g, '},');
  // Step 5: 匹配逗号后可能存在的空白符或回车，后面是 } 的情况，将这个逗号去掉
  const step5 = step4.replace(/,\s*}(?=\s*[,}])/g, '}');
  // Step 6: 去掉最后一个逗号
  const step6 = step5.replace(/,\s*$/, '');
  try {
    // 用 JSON.parse 转换为对象
    const resultObject = JSON.parse(step6);
    return resultObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
