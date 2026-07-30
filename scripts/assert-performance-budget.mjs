import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import {
  extname,
  join,
  resolve,
} from "node:path";

const root = resolve(process.cwd(), "out");
const budgets = JSON.parse(
  readFileSync(
    resolve(
      process.cwd(),
      "performance-budgets.json",
    ),
    "utf8",
  ),
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
const errors = [];

function largest(extension) {
  return Math.max(
    0,
    ...files
      .filter(
        (file) => extname(file) === extension,
      )
      .map((file) => statSync(file).size),
  );
}

const totalStaticAssetBytes = files.reduce(
  (sum, file) => sum + statSync(file).size,
  0,
);

const largestJavaScriptChunkBytes =
  largest(".js");
const largestCssFileBytes = largest(".css");
const largestHtmlFileBytes = largest(".html");

for (const [label, actual] of Object.entries({
  totalStaticAssetBytes,
  largestJavaScriptChunkBytes,
  largestCssFileBytes,
  largestHtmlFileBytes,
})) {
  const maximum = budgets[label];

  if (
    typeof maximum === "number" &&
    actual > maximum
  ) {
    errors.push(
      `${label}: ${actual} bytes exceeds ${maximum} bytes`,
    );
  }
}

for (const htmlFile of files.filter((file) =>
  file.endsWith(".html"),
)) {
  const html = readFileSync(htmlFile, "utf8");
  const references = [
    ...html.matchAll(
      /(?:src|href)=["']([^"']+\.(?:js|css))[^"']*["']/g,
    ),
  ].map((match) => match[1]);

  const assets = [...new Set(references)]
    .filter((url) => url.startsWith("/"))
    .map((url) => join(root, url));

  const routeJavaScriptBytes = assets
    .filter(
      (asset) =>
        extname(asset) === ".js" &&
        existsSync(asset),
    )
    .reduce(
      (sum, asset) => sum + statSync(asset).size,
      0,
    );

  const routeCssBytes = assets
    .filter(
      (asset) =>
        extname(asset) === ".css" &&
        existsSync(asset),
    )
    .reduce(
      (sum, asset) => sum + statSync(asset).size,
      0,
    );

  if (
    routeJavaScriptBytes >
    budgets.routeJavaScriptBytes
  ) {
    errors.push(
      `${htmlFile}: route JavaScript is ${routeJavaScriptBytes} bytes`,
    );
  }

  if (routeCssBytes > budgets.routeCssBytes) {
    errors.push(
      `${htmlFile}: route CSS is ${routeCssBytes} bytes`,
    );
  }
}

if (errors.length) {
  console.error(
    "Performance budget check failed:\n",
  );
  errors.forEach((error) =>
    console.error(`- ${error}`),
  );
  process.exit(1);
}

console.log(
  "Static export performance budgets passed.",
);
