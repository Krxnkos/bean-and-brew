const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const viewsDir = path.join(__dirname, 'views');
const buildDir = path.join(__dirname, 'build');

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Render index.ejs to index.html
const indexTemplate = fs.readFileSync(path.join(viewsDir, 'index.ejs'), 'utf-8');
const indexHtml = ejs.render(indexTemplate, {});

fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
