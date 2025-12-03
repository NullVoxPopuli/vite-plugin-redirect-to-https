import { spawn } from 'node:child_process';
import { join } from 'node:path';

export function redirectToHttps() {
  let activate = false;
  let spawned;

  /**
  * @type {import('vite').Plugin}
  */
  const plugin = {
    name: 'vite-plugin-redirect-to-https',
    config(_, env) {
      activate = env.command === 'serve' && env.isPreview === false;
    },
    configureServer(viteServer) {
      if (!activate) return;

      // Wait for Vite to actually start and determine its port
      viteServer.httpServer?.once('listening', () => {
        const address = viteServer.httpServer?.address();
        if (address && typeof address === 'object') {
          let port = address.port;

          spawned = spawn('node', [join(import.meta.dirname, 'http.js'), `--port=${port}`]);


          spawned.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });

          spawned.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
        }
      });
    }
  }

  return plugin;
}
