import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  target: 'es2020',
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
});
