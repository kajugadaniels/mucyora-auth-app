import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
} from "node:path";

const root = resolve(process.cwd(), "out");
const reportPath = resolve(
  process.cwd(),
  "reports/static-export-analysis.json",
);

if (!existsSync(root)) {
  console.error(
    "Static export not found. Run npm run build first.",
  );
  process.exit(1);
}

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path, files);
    } else {
      files.push(path);
    }
  }

  return files;
}

const files = walk(root);
const byExtension = {};
let totalBytes = 0;

for (const file of files) {
  const size = statSync(file).size;
  const extension = extname(file) || "[none]";

  totalBytes += size;
  byExtension[extension] =
    (byExtension[extension] ?? 0) + size;
}

const routes = files
  .filter((file) => file.endsWith(".html"))
  .map((htmlFile) => {
    const html = readFileSync(htmlFile, "utf8");
    const references = [
      ...html.matchAll(
        /(?:src|href)=["']([^"']+\.(?:js|css))[^"']*["']/g,
      ),
    ].map((match) => match[1]);

    const assets = [...new Set(references)]
      .filter((url) => url.startsWith("/"))
      .map((url) => {
        const path = join(root, url);
        return {
          url,
          bytes: existsSync(path)
            ? statSync(path).size
            : 0,
          type: extname(path),
        };
      });

    return {
      route: `/${relative(root, htmlFile)
        .replace(/index\.html$/, "")
        .replace(/\\/g, "/")}`,
      htmlBytes: statSync(htmlFile).size,
      javascriptBytes: assets
        .filter((asset) => asset.type === ".js")
        .reduce(
          (sum, asset) => sum + asset.bytes,
          0,
        ),
      cssBytes: assets
        .filter((asset) => asset.type === ".css")
        .reduce(
          (sum, asset) => sum + asset.bytes,
          0,
        ),
    };
  });

const largestFiles = [...files]
  .sort(
    (left, right) =>
      statSync(right).size - statSync(left).size,
  )
  .slice(0, 20)
  .map((file) => ({
    path: relative(root, file),
    bytes: statSync(file).size,
  }));

const report = {
  generatedAt: new Date().toISOString(),
  totalBytes,
  fileCount: files.length,
  byExtension,
  routes,
  largestFiles,
};

writeFileSync(
  reportPath,
  `${JSON.stringify(report, null, 2)}\n`,
  {
    encoding: "utf8",
    flag: "w",
  },
);

console.table(
  routes.map((route) => ({
    route: route.route,
    htmlKB: (route.htmlBytes / 1024).toFixed(1),
    jsKB: (
      route.javascriptBytes / 1024
    ).toFixed(1),
    cssKB: (route.cssBytes / 1024).toFixed(1),
  })),
);

console.log(`Analysis written to ${reportPath}.`);
