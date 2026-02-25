import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Creates an object that replaces `process.env.KEY` with its value.
  const processEnv = {};
  for (const key in env) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
        processEnv[`process.env.${key}`] = JSON.stringify(env[key]);
      }
    }
  }

  return {
    plugins: [
      react(),
      {
        name: 'force-remove-scripting',
        closeBundle() {
          const manifestPath = resolve(__dirname, 'dist', 'manifest.json');
          if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            if (manifest.permissions && manifest.permissions.includes('scripting')) {
              manifest.permissions = manifest.permissions.filter(p => p !== 'scripting');
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            }
          }
        }
      }
    ],
    root: 'src/extension',
    publicDir: resolve(__dirname, 'public'),
    envDir: resolve(__dirname),
    define: processEnv,
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/extension/index.html'),
          'finish-auth': resolve(__dirname, 'src/extension/finish-auth.html'),
          content: resolve(__dirname, 'src/extension/scraper.js')
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  };
});