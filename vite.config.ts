import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/lib/index.ts'),
        name: 'MathVisualLibrary',
        fileName: (format) => `math-visual-library.${format === 'es' ? 'js' : 'umd.cjs'}`,
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
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
