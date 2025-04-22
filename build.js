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

try {
  console.log('Installing dependencies...');
  execSync('npm install', { 
    cwd: path.join(__dirname, 'client'), 
    stdio: 'inherit'
  });

  console.log('Building client app...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'client'), 
    stdio: 'inherit',
    env: { ...process.env, PATH: process.env.PATH }
  });
  
  // Simple index.html file for the root in case Vite's build fails
  if (!fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
    fs.writeFileSync(
      path.join(__dirname, 'public', 'index.html'),
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EduMate - Teacher Tools</title>
        </head>
        <body>
          <div id="root">Loading EduMate application...</div>
        </body>
      </html>`
    );
  }
  
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Error during build:', error.message);
  
  // Create a fallback index.html if build fails
  fs.writeFileSync(
    path.join(__dirname, 'public', 'index.html'),
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduMate - Teacher Tools</title>
      </head>
      <body>
        <div id="root">
          <h1>EduMate Application</h1>
          <p>There was an issue loading the application. Please try again later.</p>
        </div>
      </body>
    </html>`
  );
  
  console.log('Created fallback page.');
} 