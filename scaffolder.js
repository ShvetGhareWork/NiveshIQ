const fs = require('fs');
const path = require('path');
const config = require('./scaffold_data.json');

const rootDir = 'C:\\NiveshIQ';

for (const [filepath, content] of Object.entries(config)) {
    const fullPath = path.join(rootDir, filepath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
}
console.log('Scaffolding complete');
