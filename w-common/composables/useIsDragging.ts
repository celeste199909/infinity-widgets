// useIsDragging.ts
import { ref, Ref, computed } from 'vue'

export function useIsDragging() {

    const elementIsDragging = function (targetElement: Ref<HTMLElement | null>, event: MouseEvent){
        const originPosition = ref({x:event.clientX, y:event.clientY})
        const currentPosition = ref({ x: 0, y: 0 })
        
        const isDragging = ref(false)
    
        const handleMouseDown = (event: MouseEvent) => {
            console.log('%c [ handleMouseDown ]-12', 'font-size:13px; background:pink; color:#bf2c9f;', isDragging)
            originPosition.value = { x: event.clientX, y: event.clientY }
        }
    
        const handleMouseUp = (event: MouseEvent) => {
            console.log('%c [ handleMouseUp ]-12', 'font-size:13px; background:pink; color:#bf2c9f;', isDragging)
            currentPosition.value = { x: event.clientX, y: event.clientY }
            const distance = Math.sqrt(
                Math.pow(currentPosition.value.x - originPosition.value.x, 2) +
                Math.pow(currentPosition.value.y - originPosition.value.y, 2)
            )
            if (distance > 10) {
                isDragging.value = true
            } else {
                isDragging.value = false
            }
            console.log('%c [ handleMouseUp ]-12', 'font-size:13px; background:pink; color:#bf2c9f;', isDragging)
    
        }
    
        targetElement.value?.addEventListener('mousedown', handleMouseDown)
        targetElement.value?.addEventListener('mouseup', handleMouseUp)

        return isDragging
    }

    return {
        elementIsDragging
    }
}