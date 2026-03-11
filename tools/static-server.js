const http = require("http");
const fs = require("fs");
const path = require("path");

const host = process.env.HF_HOST || "0.0.0.0";
const port = Number(process.env.HF_PORT || 8080);
const root = process.env.HF_ROOT || process.cwd();

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function safeResolve(urlPath) {
  const pathname = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relative = pathname === "/" ? "herofactory.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(root, relative);
  if (!filePath.startsWith(path.resolve(root))) {
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = safeResolve(req.url);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const contentType = mime[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`HeroFactory server listening on http://${host}:${port}`);
});
