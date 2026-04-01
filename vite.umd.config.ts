import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist/build',
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'MathVisualLibrary',
      formats: ['umd'],
      fileName: () => `math-visual-library.umd.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'motion/react', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'motion/react': 'motion',
          'lucide-react': 'Lucide',
        },
      },
    },
  },
});
