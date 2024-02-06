export interface Widget {
    id?: string;
    key: string;
    name: string;
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
}
