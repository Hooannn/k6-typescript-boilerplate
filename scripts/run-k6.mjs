import { spawn } from "node:child_process";
import path from "node:path";

const [, , scriptPath, ...args] = process.argv;

if (!scriptPath) {
  console.error("Usage: node scripts/run-k6.mjs <dist-test-file> [extra k6 args]");
  process.exit(1);
}

const resolvedScriptPath = path.resolve(scriptPath);
const k6Args = ["run", resolvedScriptPath, ...args];

const child = spawn("k6", k6Args, {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  if (error.code === "ENOENT") {
    console.error("k6 is not installed or not on PATH. Install k6 locally or use Docker.");
  } else {
    console.error(error);
  }

  process.exit(1);
});
