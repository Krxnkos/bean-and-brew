const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const viewsDir = path.join(__dirname, 'views');
const buildDir = path.join(__dirname, 'build');
const staticDir = path.join(__dirname, 'static');

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
  console.log(`Created build directory: ${buildDir}`);
}

// Function to render EJS files
function renderEjsFiles(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file.replace('.ejs', '.html'));

    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
        console.log(`Created directory: ${destPath}`);
      }
      renderEjsFiles(srcPath, destPath);
    } else if (path.extname(file) === '.ejs') {
      const template = fs.readFileSync(srcPath, 'utf-8');
      const html = ejs.render(template, {}, { root: viewsDir });
      fs.writeFileSync(destPath, html);
      console.log(`Rendered EJS file: ${srcPath} to ${destPath}`);
    }
  });
}

// Render all EJS files in the views directory
renderEjsFiles(viewsDir, buildDir);

// Copy static assets to build directory
function copyStaticAssets(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
        console.log(`Created directory: ${destPath}`);
      }
      copyStaticAssets(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied file: ${srcPath} to ${destPath}`);
    }
  });
}

copyStaticAssets(staticDir, buildDir);
