import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Never publish the browser-only demo: a production build must be connected to Supabase.
  if (command === 'build') {
    const env = loadEnv(mode, '.');
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set for a production build (see .env.production).');
    }
  }

  return {
    plugins: [react()],
    // Relative asset paths, so the build works at username.github.io/<repo>/ or any other host.
    base: './',
  };
});
