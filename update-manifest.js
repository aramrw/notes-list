import * as fs from "fs";

const FIREFOX_EXTENSION_GECKO_ID = "{bcc01dcc-731c-4e60-bdfa-fc3751c23dfc}";

// Read the JSON file
fs.readFile("dist/manifest.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Parse the JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return;
  }

  // Add the scripts property to the background section & remove chrome service worker
  if (manifest.background) {
    manifest.background.scripts = ["src/pages/background/index.ts"];
    delete manifest.background.service_worker;
  } else {
    manifest.background = { scripts: ["src/pages/background/index.ts"] };
  }

  // Add the firefox gecko id
  if (manifest.browser_specific_settings) {
    manifest.browser_specific_settings.gecko.id = FIREFOX_EXTENSION_GECKO_ID;
  } else {
    manifest.browser_specific_settings = {
      gecko: { id: FIREFOX_EXTENSION_GECKO_ID },
    };
  }

  // Convert the updated JSON back to a string
  const updatedData = JSON.stringify(manifest, null, 2);

  // Write the updated JSON back to the file
  fs.writeFile("dist/manifest.json", updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing the file:", err);
      return;
    }
    console.log("Manifest updated successfully.");
  });
});
