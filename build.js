const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Function to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Build the client app
console.log('Building client app...');
const clientBuildResult = require('child_process').spawnSync(
  'npm',
  ['run', 'build'],
  { cwd: path.join(__dirname, 'client'), stdio: 'inherit', shell: true }
);

if (clientBuildResult.status !== 0) {
  console.error('Error building client app');
  process.exit(1);
}

// Copy client build to public folder
console.log('Copying client build to public folder...');
copyDir(path.join(__dirname, 'client/dist'), path.join(__dirname, 'public'));

console.log('Build completed successfully.'); 