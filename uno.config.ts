// uno.config.ts
import {defineConfig, presetIcons, presetUno, transformerDirectives} from "unocss"
import {theme} from "@unocss/preset-mini"

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({}),
    ],
    transformers: [
        transformerDirectives(),
    ],
    rules: [
        ["m-1", {margin: "1px"}],
    ],
    shortcuts: {
        "disabled": "opacity-50 pointer-events-none",
        "text-title": "font-bold text-2xl",
        "text-main": "font-semibold text-dark-200",
        "text-alt": "text-gray-500 font-semibold",
        "text-alt-2": "text-gray-400 font-semibold",
        "entity": "font-semibold flex items-center justify-center overflow-hidden h-full text-center transition duration-200",
        "icon-bordered": "font-semibold flex border-2 border-node-border bg-dormant overflow-hidden rounded-xl text-center transition duration-200",
        "icon-horizontal-box": "w-40 h-25 flex-col justify-between transition duration-200",
        "dot": "flex min-w-[50px] border-2 border-node-border bg-dormant rounded-full items-center justify-center aspect-square",
        "gate-img": "contain h-full relative",
    },
    theme: {
        colors: {
            "theme-border": theme.colors.gray[300], // doesn't work????
            "failed": theme.colors.red[500],
            "success": theme.colors.green[500],
            "dormant": theme.colors.white,
            "connectable": "#00FF00",
            "not-connectable": "#FF0000",
            "play": theme.colors.green[500],
            "pause": theme.colors.orange[500],
            "stop": theme.colors.red[500],
            "background-floating": theme.colors.gray[100] + "EE",
            "node-border": "#1a192b",
        },
    },
})