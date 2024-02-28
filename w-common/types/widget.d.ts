export interface WidgetCov {
    key: string;
    name: string;
}


export interface Widget {
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
    tempStyle?: string;
    style?: {
        [key: string]: {
            w: number;
            h: number;
        };
    };
    onTop?: boolean;
    data?: any; // 每个组件产生的不同数据
}

