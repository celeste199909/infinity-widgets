import { ref, onMounted } from "vue";

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
        // if (Math.floor(pixelY / (cellSize + gap)) === 0) {
        //     console.log('%c [ === 0 ]-50', 'font-size:13px; background:pink; color:#bf2c9f;',)
        //     topY = gap;
        // }
        const bottomY = topY + (cellSize + gap);
        // 获取当前格子的左右边的x坐标
        let leftX = Math.floor(pixelX / (cellSize + gap)) * (cellSize + gap) + gap;
        // if (Math.floor(pixelX / (cellSize + gap)) === 0) {
        //     leftX = gap;
        // }
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

    // 通过返回值暴露所管理的状态
    return {
        layout,
        nearestPosition,
    };
}
