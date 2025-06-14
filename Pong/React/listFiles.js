// listFiles.js

const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname); // Set the directory path to the current folder

function listFiles(dir, depth = 0) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();

        // Exclude "node_modules"
        if (file === 'node_modules') return;

        console.log(`${'  '.repeat(depth)}- ${file}`);

        if (isDirectory) {
            listFiles(fullPath, depth + 1);
        }
    });
}

console.log('File Directory Structure:');
listFiles(directoryPath);
