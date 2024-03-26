// uno.config.ts
import {defineConfig, presetIcons, presetUno} from "unocss"
import {theme} from "@unocss/preset-mini"

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({}),
    ],
    rules: [
        ["m-1", {margin: "1px"}],
    ],
    shortcuts: {
        "button-square": "hover:shadow-md shadow-gray-300 border-2 bg-white text-black font-bold p-2 rounded-xl aspect-square text-3xl transition duration-150 cursor-pointer",
        "button-gate": "hover:shadow-md shadow-gray-300 border-2 bg-white-500 text-black font-bold p-2 rounded-xl aspect-square text-3xl transition duration-150 cursor-pointer",
        "text-title": "font-bold text-2xl",
        "text-main": "font-semibold",
        "text-alt": "text-gray-500 font-semibold",
    },
    theme: {
        extend: {
            colors: {
                "theme-border": theme.colors.gray[300], // doesn't work????
            },
        },
    },
})