const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Ensure public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Copy an empty vercel.json to public directory to ensure proper MIME types
fs.writeFileSync(
  path.join(__dirname, 'public', 'vercel.json'),
  JSON.stringify({
    "routes": [
      {
        "src": "^/assets/(.*)",
        "headers": { "cache-control": "public, max-age=31536000, immutable" }
      },
      {
        "src": "^/(.*).js$",
        "headers": { "content-type": "application/javascript; charset=utf-8" }
      },
      { "handle": "filesystem" },
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }, null, 2)
);

// Build the client app (Vite will output directly to ../public)
console.log('Building client app...');
try {
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'client'), 
    stdio: 'inherit'
  });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Error building client app');
  process.exit(1);
} 