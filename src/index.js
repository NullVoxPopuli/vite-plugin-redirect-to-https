import { createServer } from 'node:http';

/**
 * @typedef {Object} RedirectOptions
 * @property {number} [httpPort] - The port for the HTTP redirect server (defaults to 80, or httpsPort - 363 if httpsPort is set)
 */

/**
 * @param {RedirectOptions} [options]
 */
export function redirectToHttps(options = {}) {
  let activate = false;
  let httpsPort = -1;
  let httpServer = null;

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
          httpsPort = address.port;
          let httpPort = address.port;

          // Create HTTP server that redirects to HTTPS
          httpServer = createServer((req, res) => {
            const host = req.headers.host?.split(':')[0] || 'localhost';
            const httpsUrl = `https://${host}:${httpsPort}${req.url}`;
            
            res.writeHead(301, { 
              Location: httpsUrl,
              'Content-Type': 'text/plain'
            });
            res.end(`Redirecting to ${httpsUrl}`);
          });

          httpServer.listen(httpPort, (err) => {
            if (err) {
              console.error(`Failed to start HTTP redirect server on port ${httpPort}:`, err.message);
              if (err.code === 'EACCES') {
                console.log(`Port ${httpPort} requires elevated privileges. Try: sudo setcap cap_net_bind_service=+ep $(which node)`);
                console.log(`Or use a higher port like: redirectToHttps({ httpPort: 8080 })`);
              }
            } else {
              console.log(`HTTP redirect server listening on http://localhost:${httpPort} -> https://localhost:${httpsPort}`);
            }
          });
        }
      });

      // Clean up the HTTP server when Vite server closes
      viteServer.httpServer?.on('close', () => {
        if (httpServer) {
          httpServer.close();
          httpServer = null;
        }
      });
    }
  }

  return plugin;
}
