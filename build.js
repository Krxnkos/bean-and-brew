const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const viewsDir = path.join(__dirname, 'views');
const buildDir = path.join(__dirname, 'build');
const partialsDir = path.join(viewsDir, 'partials');
const buildPartialsDir = path.join(buildDir, 'partials');

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Create build/partials directory if it doesn't exist
if (!fs.existsSync(buildPartialsDir)) {
  fs.mkdirSync(buildPartialsDir);
}

// Copy partials files to build/partials directory
fs.readdirSync(partialsDir).forEach(file => {
  fs.copyFileSync(path.join(partialsDir, file), path.join(buildPartialsDir, file));
});

// Render index.ejs to index.html
const indexTemplate = fs.readFileSync(path.join(viewsDir, 'index.ejs'), 'utf-8');
const indexHtml = ejs.render(indexTemplate, {}, { views: [viewsDir] });

fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
