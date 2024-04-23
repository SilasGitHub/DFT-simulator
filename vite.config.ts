import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import UnocssVitePlugin from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.BASE_URL || "/",
    plugins: [
        UnocssVitePlugin(),
        react(),
    ],
})
