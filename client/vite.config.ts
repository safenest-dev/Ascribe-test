// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
      //@ts-ignore
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts', // Must match the file path
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**', 
        'src/App.tsx', 
        'src/main.tsx', 
        'src/services/**', 
        'eslint.config.js',
        'vite-env.d.ts',
        'vite.config.ts'
      ],
    },
    
  },
});