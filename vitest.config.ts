import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// src/lib/util.ts imports rating-plate PNGs at module load (Next turns these
// into StaticImageData). Vitest has no asset pipeline, so stub any static-asset
// import with an empty module to keep those files importable in tests.
const stubStaticAssets = {
    name: 'stub-static-assets',
    enforce: 'pre' as const,
    load(id: string) {
        if (/\.(png|jpe?g|gif|svg|webp|avif|ico)(\?.*)?$/.test(id)) {
            return 'export default {};';
        }
        return null;
    },
};

export default defineConfig({
    plugins: [stubStaticAssets],
    resolve: {
        alias: {
            '@': path.resolve(rootDir, './src'),
        },
    },
    test: {
        environment: 'node',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
