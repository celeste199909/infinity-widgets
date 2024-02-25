/// <reference types="vite/client" />
interface Widget {
    id?: string;
    key: string;
    name: string;
    isDragging?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    position: {
        x: number;
        y: number;
    };
    size: {
        w: number;
        h: number;
    };
    currentStyle?: string;
    style?: {
        [key: string]: {
            w: number;
            h: number;
        };
    };
    onTop?: boolean;
    data?: any; // 每个组件产生的不同数据
}

interface Window {
    preload: {
        createWidgetsWrapper: () => void;
        removeWidgetsWrapper: () => void;
        addWidget: (widgetKey: string) => void;
        removeWidget: (widget: string) => void;
        setEditMode: (editMode: boolean) => void;
        removeAllWidgets: () => void;

        // 置顶
        createTopWidgetsWrapper: () => void;
        removeTopWidgetsWrapper: () => void;
    }
    // win-widgets
    winWidget: {
        addWidgetToTop: (widget: string) => void;
    }
    // win-top
    winTop: {
        addWidgetToOrigin: (widget: string) => void;
    }
    // win-widgets
    getIconsByPath: (path: string) => Promise<Object[]>;
}
