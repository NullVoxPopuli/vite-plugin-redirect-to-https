import { defineConfig } from "vite";

import mkcert from 'vite-plugin-mkcert'
import { redirectToHttps } from './src/index.js';

export default defineConfig(() => ({
  plugins: [
    // @ts-expect-error
    mkcert(),
    redirectToHttps(),
  ],
}));
