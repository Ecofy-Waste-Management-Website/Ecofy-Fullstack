const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('emerald')) {
                const newContent = content.replace(/emerald/g, 'green');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

replaceInFiles(path.join(__dirname, 'frontend/src'));
console.log('Done replacing emerald with green.');
