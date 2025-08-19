import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es5',
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options, context) {
    if (context.format === 'cjs') {
      options.banner = {
        js: '"use client";',
      };
    };
  },
  treeshake: true,
  splitting: false,
  loader: {
    '.css': 'css',
  },
});
