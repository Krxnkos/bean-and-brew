const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const buildDir = path.join(__dirname, 'build', 'views');

// Ensure partials are copied
const partialsDir = path.join(viewsDir, 'partials');
const buildPartialsDir = path.join(buildDir, 'partials');

if (!fs.existsSync(buildPartialsDir)) {
    fs.mkdirSync(buildPartialsDir, { recursive: true });
}

// Copy partial files
fs.readdirSync(partialsDir).forEach(file => {
    fs.copyFileSync(path.join(partialsDir, file), path.join(buildPartialsDir, file));
    console.log(`Copied partial file: ${file}`);
});
