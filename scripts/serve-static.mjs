import {
  createReadStream,
  existsSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import {
  extname,
  join,
  normalize,
  resolve,
} from "node:path";

const root = resolve(
  process.cwd(),
  process.argv[2] ?? "out",
);
const port = Number(process.argv[3] ?? "4173");

if (!existsSync(root)) {
  console.error(
    `Static directory does not exist: ${root}`,
  );
  process.exit(1);
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(
    urlPath.split("?")[0] || "/",
  );

  const safe = normalize(decoded).replace(
    /^(\.\.(\/|\\|$))+/,
    "",
  );

  let candidate = join(root, safe);

  if (
    candidate.endsWith("/") ||
    (existsSync(candidate) &&
      statSync(candidate).isDirectory())
  ) {
    candidate = join(candidate, "index.html");
  }

  if (!existsSync(candidate)) {
    candidate = join(root, "404.html");
  }

  return candidate;
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(
    request.url ?? "/",
  );

  response.setHeader(
    "Content-Type",
    contentTypes[extname(filePath)] ??
      "application/octet-stream",
  );

  response.setHeader(
    "Cache-Control",
    extname(filePath) === ".html"
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  );

  createReadStream(filePath)
    .on("error", () => {
      response.statusCode = 500;
      response.end("Unable to read static file.");
    })
    .pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(
    `Serving ${root} at http://127.0.0.1:${port}`,
  );
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
