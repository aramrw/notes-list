import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [majorV, minorV, patchV, labelV = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${majorV}.${minorV}.${patchV}.${labelV}`,
  description: packageJson.description,
  options_page: "src/pages/options/index.html",
  background: {
    scripts: ["src/pages/background/index.ts"],
    service_worker: "src/pages/background/index.ts",
    type: "module",
  },
  permissions: [
    "contextMenus",
    "activeTab",
    "tabs",
    "webNavigation",
    "history",
    "storage",
    "unlimitedStorage",
    "scripting",
  ],
  commands: {
    copy_text: {
      suggested_key: {
        default: "Ctrl+Shift+Y",
      },
      description: "Copy Selected Text",
    },
  },
  action: {
    //default_popup: "src/pages/popup/index.html",
    default_icon: "icons/34x34.png",
  },
  chrome_url_overrides: {
    newtab: "src/pages/newtab/index.html",
  },
  icons: {
    "128": "icons/128x128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.tsx"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "assets/img/*"],
      matches: ["*://*/*"],
    },
  ],
}));

export default manifest;
