// Lightweight Static HTTP Server for Garpoo Cafe Web App
// Works with both Deno and Node.js

const PORT = 5173;

// If running in Deno
if (typeof Deno !== 'undefined') {
  const mimeTypes = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
  };

  Deno.serve({ port: PORT }, async (req) => {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';

    // Map public assets
    let filePath = `.${pathname}`;
    if (pathname.startsWith('/images/')) {
      filePath = `./public${pathname}`;
    }

    try {
      const file = await Deno.readFile(filePath);
      const ext = pathname.substring(pathname.lastIndexOf('.'));
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      return new Response(file, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e) {
      // Fallback for SPA routing if needed
      try {
        const indexFile = await Deno.readFile('./index.html');
        return new Response(indexFile, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=UTF-8' }
        });
      } catch (err) {
        return new Response('404 Not Found', { status: 404 });
      }
    }
  });

  console.log(`🚀 Garpoo Cafe Web App running at: http://localhost:${PORT}`);
}
