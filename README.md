# vite-plugin-redirect-to-https

> [!NOTE]
> It's not possibl to implement this. in node, bun, etc. It's not possible to run two processes on the same port

When using https with vite, either with [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert), you may accidentally find you (or your browser) navigating to http URLs accidental instead of https.

_This plugin fixes that_.

When booting a vite app, visiting the http URL will redirect you to https.

Also, this plugin has _0 dependencies_.

## Install

```bash
npm add --save-dev vite-plugin-redirect-to-https
```

## Usage

In your vite config

```js
import { defineConfig } from "vite";
import { redirectToHttps } from 'vite-plugin-redirect-to-https';

export default defineConfig(() => ({
  plugins: [
    redirectToHttps(),
  ],
}));
```
