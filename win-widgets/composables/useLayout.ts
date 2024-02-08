import { ref } from "vue";
import { Widget } from "@/types/widget";

// 按照惯例，组合式函数名以“use”开头
export function useLayout() {
    const padding = 10;
    const extraPaddingBottom = 50;
    const cellSize = 30;
    const widgetUnit = 60;
    const gap = 10;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2 - extraPaddingBottom;
    const rows = Math.floor((innerHeight - gap) / (cellSize + gap));
    const cols = Math.floor((innerWidth - gap) / (cellSize + gap));
    const gridWidth = cols * (cellSize + gap) + gap;
    const gridHeight = rows * (cellSize + gap) + gap;
    // gird 边界与 inner 边界距离 // 不常用
    const gridToInnerLeft = (width - gridWidth) / 2;
    const gridToInnerTop = (height - gridHeight) / 2;
    // 不常用
    const gridLeft = (innerWidth - gridWidth) / 2 + padding;
    const gridTop = (innerHeight - gridHeight) / 2 + padding;

    // 被组合式函数封装和管理的状态
    const layout = ref({
        width,
        height,
        innerWidth,
        innerHeight,
        gridWidth,
        gridHeight,
        padding,
        extraPaddingBottom,
        cellSize,
        rows,
        cols,
        gridLeft,
        gridTop,
        gap,
        gridToInnerLeft,
        gridToInnerTop,
        widgetUnit,
    });

    // 输入坐标，获取当前格子的四个顶点中最近顶点坐标
    function nearestPosition(pixelX: number, pixelY: number) {
        // 获取当前格子的上下边的y坐标
        let topY = Math.floor(pixelY / (cellSize + gap)) * (cellSize + gap) + gap;
        const bottomY = topY + (cellSize + gap);
        // 获取当前格子的左右边的x坐标
        let leftX = Math.floor(pixelX / (cellSize + gap)) * (cellSize + gap) + gap;
        const rightX = leftX + (cellSize + gap);
        // 获取当前格子的四个顶点坐标
        const topLeft = { x: leftX, y: topY };
        const topRight = { x: rightX, y: topY };
        const bottomLeft = { x: leftX, y: bottomY };
        const bottomRight = { x: rightX, y: bottomY };
        // 计算当前像素坐标与四个顶点的距离
        const distance = [
            Math.sqrt((pixelX - topLeft.x) ** 2 + (pixelY - topLeft.y) ** 2),
            Math.sqrt((pixelX - topRight.x) ** 2 + (pixelY - topRight.y) ** 2),
            Math.sqrt((pixelX - bottomLeft.x) ** 2 + (pixelY - bottomLeft.y) ** 2),
            Math.sqrt((pixelX - bottomRight.x) ** 2 + (pixelY - bottomRight.y) ** 2),
        ];
        // 返回距离最小的顶点坐标
        return [topLeft, topRight, bottomLeft, bottomRight][
            distance.indexOf(Math.min(...distance))
        ];
    }

    // 输入坐标，获取在grid中的坐标
    function getGridPosition(x: number, y: number) {
        const { cellSize, gap } = layout.value;
        return {
            x: Math.floor(x / (cellSize + gap)),
            y: Math.floor(y / (cellSize + gap)),
        };
    }

    // 输入长度，获取在grid中的长度
    function getGridLength(length: number) {
        const { cellSize, gap } = layout.value;
        return Math.floor(length / (cellSize + gap)) + 1; //+1 , 权宜之计
    }

    // 输入 grid 中的坐标，获取像素坐标
    function getPixelPosition(x: number, y: number) {
        const { cellSize, gap } = layout.value;
        return {
            x: x * (cellSize + gap) + gap,
            y: y * (cellSize + gap) + gap,
        };
    }

    // 获取当前最近可放置的格子的坐标，参数：1 所有已放置的组件数据, 2 要放置的组件数据
    function getNearestEmptyPosition(showWidgets: Widget[], putWidget: Widget) {
        const { cols, rows, gap, cellSize } = layout.value;
        // 初始化一个二维数组，用于记录每个格子是否被占用
        const grid = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 0)
        );
        // 遍历所有已放置的组件，将占用的格子标记为1
        showWidgets.forEach((widget) => {
            const { x, y } = getGridPosition(widget.position.x, widget.position.y);
            for (let i = y; i < y + getGridLength(widget.size.h); i++) {
                for (let j = x; j < x + getGridLength(widget.size.w); j++) {
                    grid[i][j] = 1;
                }
            }
        });
        console.log('%c [ grid ]-105', 'font-size:13px; background:pink; color:#bf2c9f;', grid)
        // 遍历所有格子，找到最近可放置的格子
        const w = getGridLength(putWidget.size.w);
        const h = getGridLength(putWidget.size.h);
        let x = 0;
        let y = 0;
        for (let i = 0; i < rows - h; i++) {
            for (let j = 0; j < cols - w; j++) {
                let flag = true;
                for (let m = i; m < i + h; m++) {
                    for (let n = j; n < j + w; n++) {
                        if (grid[m][n] === 1) {
                            flag = false;
                            break;
                        }
                    }
                    if (!flag) {
                        break;
                    }
                }
                if (flag) {
                    x = j;
                    y = i;
                    break;
                }
            }
            if (x || y) {
                break;
            }
        }
        // x y 都 +1 , 权宜之计
        // return {
        //     x: getPixelPosition(x + 1, y + 1).x,
        //     y: getPixelPosition(x + 1, y + 1).y,
        // };
        return {
            x: getPixelPosition(x, y).x,
            y: getPixelPosition(x, y).y,
        };
    }

    // 通过返回值暴露所管理的状态
    return {
        layout,
        nearestPosition,
        getNearestEmptyPosition
    };
}
