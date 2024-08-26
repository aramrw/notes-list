import * as fs from 'fs';

// Read the JSON file
fs.readFile('dist/manifest.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON
  let manifest;
  try {
    manifest = JSON.parse(data);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return;
  }

  // Add the scripts property to the background section
  if (manifest.background) {
    manifest.background.scripts = ['src/pages/background/index.ts'];
  } else {
    manifest.background = { scripts: ['src/pages/background/index.ts'] };
  }

  // Convert the updated JSON back to a string
  const updatedData = JSON.stringify(manifest, null, 2);

  // Write the updated JSON back to the file
  fs.writeFile('dist/manifest.json', updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('Manifest updated successfully.');
  });
});

