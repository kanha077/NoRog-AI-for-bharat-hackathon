import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Writable uploads directory (local disk or serverless /tmp). */
export function getUploadsDir() {
  return process.env.VERCEL
    ? path.join(os.tmpdir(), "norog-uploads")
    : path.join(__dirname, "uploads");
}
