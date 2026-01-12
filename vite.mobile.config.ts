import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    // Root is resources/mobile so that index.html is found easily as entry
    root: 'resources/mobile',
    base: './', // Relative paths for file:// protocol support in Capacitor
    publicDir: 'public_static',
    build: {
        outDir: '../../public/mobile_build', // Output to public/mobile_build
        emptyOutDir: true,
        rollupOptions: {
            // No need to specify input if index.html is in root
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/mobile'),
            // Allow importing from main app if needed, but be careful
        },
    },
});
