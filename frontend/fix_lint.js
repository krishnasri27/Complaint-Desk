const fs = require('fs');
const path = require('path');

// Fixes for all files
const fixFile = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace broken template literals: {"some string }} with {\some string \\}
        content = content.replace(/className=\{(?:"|')([^"']+)(?:"|')\s*\}\}/g, "className={\$1\}"); // extremely specific broken stuff
        
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
    } catch(e) {
        console.log('Error', filePath, e.message);
    }
};

// Actually, I can just write out the full content of the files correctly if needed.
// But first let's see which files are broken by linting.
const { execSync } = require('child_process');
try {
  execSync('npx eslint .', { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
