// listFiles.js

const fs = require('fs');
const path = require('path');

function generateTree(dir, indent = '') {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        console.log(indent + (stat.isDirectory() ? '📁 ' : '📄 ') + file);
        if (stat.isDirectory()) {
            generateTree(filePath, indent + '    ');
        }
    });
}

const projectPath = path.resolve(__dirname); // Uses the current script directory
generateTree(projectPath);

