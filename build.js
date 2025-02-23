const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const buildDir = path.join(__dirname, 'build');
const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const staticDir = path.join(__dirname, 'static'); // Assuming your CSS and images are in a 'static' directory

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Create partials directory in build directory
const buildPartialsDir = path.join(buildDir, 'views', 'partials');
fs.mkdirSync(buildPartialsDir, { recursive: true });

// Copy partials to build directory
fs.readdirSync(partialsDir).forEach(file => {
    const srcFile = path.join(partialsDir, file);
    const destFile = path.join(buildPartialsDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied partial file: ${file}`);
});

// Function to copy directories recursively
function copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            copyDirectory(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied file: ${file}`);
        }
    });
}

// Copy static assets (CSS and images) to build directory
copyDirectory(staticDir, buildDir);

// Function to render EJS files
function renderEjsFiles(srcDir, destDir) {
    fs.readdirSync(srcDir).forEach(file => {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);

        if (fs.lstatSync(srcFile).isDirectory()) {
            fs.mkdirSync(destFile, { recursive: true });
            renderEjsFiles(srcFile, destFile);
        } else if (path.extname(file) === '.ejs') {
            const template = fs.readFileSync(srcFile, 'utf-8');
            const html = ejs.render(template, {}, { filename: srcFile });
            fs.writeFileSync(destFile.replace('.ejs', '.html'), html);
            console.log(`Rendered EJS file: ${file}`);
        } else {
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied file: ${file}`);
        }
    });
}

// Render EJS files from views directory to build directory
renderEjsFiles(viewsDir, buildDir);
