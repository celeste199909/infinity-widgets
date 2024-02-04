/// <reference types="vite/client" />
interface Window {
    preload: {
        createWidgetsWrapper: () => void;
        removeWidgetsWrapper: () => void;
        addWidget: (widget: string) => void;
        removeWidget: (widget: string) => void;
        setEditMode: (editMode: boolean) => void;
    }
}
