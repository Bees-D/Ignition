const { execSync } = require('child_process');
const path = require('path');

function run(command) {
    console.log(`Running: ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (err) {
        console.error(`Command failed: ${command}`);
        process.exit(1);
    }
}

// 1. Build workspaces
run('npm run build --workspaces --if-present');

// 2. Run artifact copy script
const copyScript = path.join(__dirname, 'copy-dist.js');
run(`node ${copyScript}`);

console.log('Production build completed successfully.');
