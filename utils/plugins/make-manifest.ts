import * as fs from "fs";
import * as path from "path";
import manifest from "../../src/manifest";
import colorLog from "../log";

const { resolve } = path;

const outDir = resolve(
  "F:\\Programming\\Typescript\\notes-list\\dist"
);

async function overwriteManifest() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const manifestPath = resolve(outDir, "manifest.json");

  try {
    const resolvedManifest = manifest;
    fs.writeFileSync(manifestPath, JSON.stringify(resolvedManifest, null, 2));
    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  } catch (error) {
    colorLog(`Failed to generate manifest: ${error.message}`, "error");
  }
}

export default overwriteManifest;
