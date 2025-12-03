import http from 'node:http';

let port = process.argv.find(x => x.startsWith('--port'))?.split('=')[1];

const server = http.createServer((req, res) => {
  const host = req.headers.host;
  const location = `https://${host}${req.url ?? ''}`;

  res.writeHead(302, {
    Location: location,
    'Content-Length': '0',
  });
  res.end();
});

server.listen(port, () => {
  console.log(`HTTP -> HTTPS redirect server listening on port ${port}`);
});
