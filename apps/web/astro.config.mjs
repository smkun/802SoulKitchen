import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
  },
  build: {
    assets: 'assets',
  },
  site: process.env.PUBLIC_SITE_URL || 'https://802soulkitchen.com',
});