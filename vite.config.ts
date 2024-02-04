// vite.config.js
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("./"),
            "com": _resolve("./w-common"),
        },
    },
    plugins: [
        vue()
    ],
    base: "./",
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                "win-main": 'index.html',
                "win-widgets": 'win-widgets/index.html',
            },
            output: {
                entryFileNames: '[name]/[name].js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        // 不压缩
        minify: false,
    },

});
