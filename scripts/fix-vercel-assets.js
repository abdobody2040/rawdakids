// scripts/fix-vercel-assets.js
// Post-export script to rename dist/assets/node_modules to dist/assets/vendor
// and patch references in bundles so Vercel doesn't block node_modules asset paths.

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const nodeModulesAssetsDir = path.join(distDir, 'assets', 'node_modules');
const vendorAssetsDir = path.join(distDir, 'assets', 'vendor');

console.log('[fix-vercel-assets] Running post-export asset fix...');

if (!fs.existsSync(distDir)) {
  console.log('[fix-vercel-assets] No dist directory found. Skipping.');
  process.exit(0);
}

// 1. Move/rename dist/assets/node_modules -> dist/assets/vendor
if (fs.existsSync(nodeModulesAssetsDir)) {
  if (fs.existsSync(vendorAssetsDir)) {
    fs.rmSync(vendorAssetsDir, { recursive: true, force: true });
  }
  fs.renameSync(nodeModulesAssetsDir, vendorAssetsDir);
  console.log('[fix-vercel-assets] Renamed dist/assets/node_modules -> dist/assets/vendor');
} else {
  console.log('[fix-vercel-assets] dist/assets/node_modules does not exist (may already be renamed or empty).');
}

// 2. Recursively find all .js, .html, .json files under dist and replace references
function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

let patchedFilesCount = 0;
const validExtensions = new Set(['.js', '.html', '.json', '.map']);

walkDir(distDir, (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (!validExtensions.has(ext)) return;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('assets/node_modules') || content.includes('assets\\/node_modules')) {
      const replaced = content
        .replace(/assets\/node_modules/g, 'assets/vendor')
        .replace(/assets\\\/node_modules/g, 'assets\\/vendor');
      fs.writeFileSync(filePath, replaced, 'utf8');
      patchedFilesCount++;
    }
  } catch (err) {
    console.warn(`[fix-vercel-assets] Failed to patch ${filePath}:`, err.message);
  }
});

console.log(`[fix-vercel-assets] Complete. Patched ${patchedFilesCount} file(s).`);

