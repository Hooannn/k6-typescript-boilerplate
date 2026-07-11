import { mkdir } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const tmpDir = path.join(rootDir, ".tmp");
const archivePath = path.join(tmpDir, "k6-bundle.tar");

await mkdir(tmpDir, { recursive: true });
await execFileAsync("tar", ["-cf", archivePath, "-C", path.join(rootDir, "dist"), "."]);

console.log(`Created archive at ${archivePath}`);
