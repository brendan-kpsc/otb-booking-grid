const fs = require('fs');
const path = require('path');

// Adjust the build folder path if needed.
const buildFolder = path.join(__dirname, 'build');
const indexPath = path.join(buildFolder, 'index.html');

let indexHtml;
try {
  indexHtml = fs.readFileSync(indexPath, 'utf8');
} catch (err) {
  console.error(`Error reading ${indexPath}:`, err);
  process.exit(1);
}

// --- Step 1: Make file references relative ---
// This regex finds any href or src attributes that start with "/" and changes them to start with "./"
indexHtml = indexHtml.replace(/(href|src)=["']\/(.*?)["']/g, '$1="./$2"');

// --- Step 2: Rename main CSS and JS files ---

// Helper function that renames a file in a given directory.
function renameFile(relativeDir, oldFileName, newFileName) {
  const oldPath = path.join(buildFolder, relativeDir, oldFileName);
  const newPath = path.join(buildFolder, relativeDir, newFileName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldPath} to ${newPath}`);
  } else {
    console.warn(`File not found: ${oldPath}`);
  }
}

// Rename the main CSS file:
// Look for a reference matching "./static/css/main.[hash].css"
const cssRegex = /(\.\/static\/css\/)(main\.[^.]+\.css)/;
const cssMatch = indexHtml.match(cssRegex);
if (cssMatch) {
  const oldCssName = cssMatch[2]; // e.g., "main.71251d64.css"
  const newCssName = 'main.css';
  // Rename the file on disk.
  renameFile('static/css', oldCssName, newCssName);
  // Update the reference in the HTML.
  indexHtml = indexHtml.replace(oldCssName, newCssName);
} else {
  console.warn("Main CSS file reference not found in index.html.");
}

// Rename the main JS file:
// Look for a reference matching "./static/js/main.[hash].js"
const jsRegex = /(\.\/static\/js\/)(main\.[^.]+\.js)/;
const jsMatch = indexHtml.match(jsRegex);
if (jsMatch) {
  const oldJsName = jsMatch[2]; // e.g., "main.695176ce.js"
  const newJsName = 'main.js';
  // Rename the file on disk.
  renameFile('static/js', oldJsName, newJsName);
  // Update the reference in the HTML.
  indexHtml = indexHtml.replace(oldJsName, newJsName);
} else {
  console.warn("Main JS file reference not found in index.html.");
}

// --- Step 3: Write the modified HTML to a new file ---
const outputPath = path.join(buildFolder, 'index.htm');
fs.writeFileSync(outputPath, indexHtml, 'utf8');
console.log(`Modified file created at: ${outputPath}`);
