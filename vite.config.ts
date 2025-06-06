import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: {
                'bundle': 'lib/index.ts',
            },
            name: 'nightshade-code-editor',
            formats: ['es'],
            cssFileName: 'components',
        },
        rollupOptions: {
            external: ['vue'],
        },
    },
    plugins: [
        vue(),
        dts({
            include: ['lib/**'],
        }),
    ],
    esbuild: {
        legalComments: 'none',
        keepNames: true,
    },
    server: {
        port: 8881
    }
});
