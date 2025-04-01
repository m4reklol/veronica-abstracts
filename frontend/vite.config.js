import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: path.resolve(__dirname, '../backend/public'),
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
  },
});
