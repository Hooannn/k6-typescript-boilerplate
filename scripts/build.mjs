import { mkdir } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { build } from "esbuild";

const rootDir = process.cwd();
const sourceRoot = path.join(rootDir, "src", "tests");
const outdir = path.join(rootDir, "dist", "tests");

const entries = await fg("**/*.ts", {
  cwd: sourceRoot,
  absolute: true,
});

if (entries.length === 0) {
  console.error("No k6 test entrypoints found under src/tests.");
  process.exit(1);
}

await mkdir(outdir, { recursive: true });

await Promise.all(
  entries.map(async (entry) => {
    const relativeName = path.relative(sourceRoot, entry).replace(/\.ts$/, ".js");
    await build({
      entryPoints: [entry],
      outfile: path.join(outdir, relativeName),
      bundle: true,
      format: "esm",
      platform: "neutral",
      target: "es2022",
      sourcemap: true,
      external: ["k6", "k6/*"],
      tsconfig: path.join(rootDir, "tsconfig.json"),
      alias: {
        "@": path.join(rootDir, "src"),
      },
      banner: {
        js: "// Generated bundle for k6. Do not edit directly.",
      },
    });
  }),
);

console.log(`Bundled ${entries.length} k6 test file(s) into dist/tests.`);
