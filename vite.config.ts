import { defineConfig } from "vite"
export default defineConfig({
    build: { 
       chunkSizeWarningLimit: 100000000
    },
    base: "/bangkok/" 
});
//export default defineConfig({ base: "/bangkok/" });
