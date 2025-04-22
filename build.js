const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

// Ensure public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

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
  
  // Create _redirects file for client-side routing
  fs.writeFileSync(
    path.join(__dirname, 'public', '_redirects'),
    `/* /index.html 200`
  );
  
  // Create vercel.json inside public folder for proper routing
  fs.writeFileSync(
    path.join(__dirname, 'public', 'vercel.json'),
    JSON.stringify({
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }, null, 2)
  );

  // Create a static 404.html that redirects to index.html
  fs.writeFileSync(
    path.join(__dirname, 'public', '404.html'),
    `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>EduMate - Teacher Tools</title>
        <script type="text/javascript">
          // Single Page Apps for GitHub Pages
          // MIT License
          // https://github.com/rafgraph/spa-github-pages
          var segmentCount = 0;
          var l = window.location;
          l.replace(
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
            l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
            (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash
          );
        </script>
      </head>
      <body>
      </body>
    </html>`
  );
  
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
  
  // Create _redirects file for client-side routing
  fs.writeFileSync(
    path.join(__dirname, 'public', '_redirects'),
    `/* /index.html 200`
  );
  
  console.log('Created fallback page.');
} 