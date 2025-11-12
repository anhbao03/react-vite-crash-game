import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Read language from environment variable or default to en_US
  const langCode = process.env.VITE_LANG_CODE || 'en_US';
  
  console.log(`[Vite] Building with language: ${langCode}`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Inject language code at build time for tree-shaking
      'import.meta.env.VITE_LANG_CODE': JSON.stringify(langCode),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: `dist/${langCode}`,
      sourcemap: true,
      rollupOptions: {
        output: {
          // Add language code to output filenames for clarity
          entryFileNames: `assets/[name]-${langCode}-[hash].js`,
          chunkFileNames: `assets/[name]-${langCode}-[hash].js`,
          assetFileNames: `assets/[name]-${langCode}-[hash].[ext]`,
        },
      },
    },
  };
});
