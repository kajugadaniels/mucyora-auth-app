import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const scanRoots = [join(root, "src"), join(root, "public")];
const patterns = ["linear-gradient(", "radial-gradient(", "conic-gradient("];
const extensions = new Set([".css", ".ts", ".tsx", ".svg"]);
const errors = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!extensions.has(extname(path))) continue;
    const source = readFileSync(path, "utf8").toLowerCase();
    for (const pattern of patterns) {
      if (source.includes(pattern)) errors.push(`${relative(root, path)} contains forbidden ${pattern}`);
    }
  }
}

scanRoots.forEach(walk);

if (errors.length) {
  console.error("Gradient prohibition check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Gradient prohibition check passed.");