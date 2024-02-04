import { ref, onMounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useLayout() {

    const padding = 10
    const extraPaddingBottom = 50
    const cellSize = 30
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const innerWidth = width - padding * 2
    const innerHeight = height - padding * 2 - extraPaddingBottom
    const rows = Math.floor((innerHeight - padding * 2) / cellSize)
    const cols = Math.floor((innerWidth - padding * 2) / cellSize)
    const gridWidth = cols * cellSize
    const gridHeight = rows * cellSize
    const gridLeft = (innerWidth - gridWidth) / 2 + padding
    const gridTop = (innerHeight - gridHeight) / 2 + padding

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
    })

    // 输入坐标，获取当前格子的四个顶点中最近顶点坐标
    function nearestPosition(pixelX: number, pixelY: number) {
        // 获取当前格子的上下边的y坐标
        const topY = Math.floor(pixelY / cellSize) * cellSize
        const bottomY = topY + cellSize
        // 获取当前格子的左右边的x坐标
        const leftX = Math.floor(pixelX / cellSize) * cellSize
        const rightX = leftX + cellSize
        // 获取当前格子的四个顶点坐标
        const topLeft = { x: leftX, y: topY }
        const topRight = { x: rightX, y: topY }
        const bottomLeft = { x: leftX, y: bottomY }
        const bottomRight = { x: rightX, y: bottomY }
        // 计算当前像素坐标与四个顶点的距离
        const distance = [
            Math.sqrt((pixelX - topLeft.x) ** 2 + (pixelY - topLeft.y) ** 2),
            Math.sqrt((pixelX - topRight.x) ** 2 + (pixelY - topRight.y) ** 2),
            Math.sqrt((pixelX - bottomLeft.x) ** 2 + (pixelY - bottomLeft.y) ** 2),
            Math.sqrt((pixelX - bottomRight.x) ** 2 + (pixelY - bottomRight.y) ** 2),
        ]
        // 返回距离最小的顶点坐标
        return [
            topLeft,
            topRight,
            bottomLeft,
            bottomRight,
        ][distance.indexOf(Math.min(...distance))]
    }


    // 通过返回值暴露所管理的状态
    return {
        layout,
        nearestPosition,
    }
}