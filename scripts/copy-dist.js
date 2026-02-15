const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const copyFile = (src, dest) => {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(distDir, dest));
        console.log(`Copied ${src} to dist/${dest}`);
    } else {
        console.warn(`Warning: Source file ${src} not found.`);
    }
};

// Copy artifacts from packages
copyFile(path.join(__dirname, '../packages/ignition-kernel/dist/ignition.sw.js'), 'ignition.sw.js');
copyFile(path.join(__dirname, '../packages/ignition-sandbox/dist/ignition.bundle.js'), 'ignition.bundle.js');
copyFile(path.join(__dirname, '../packages/ignition-core/pkg/ignition_core_bg.wasm'), 'ignition_core_bg.wasm');

// Ensure index.html exists for Vercel SPA handling/Demo
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ignition Engine Demo</title>
    <script src="ignition.bundle.js"></script>
</head>
<body style="background:#111; color:#fff; font-family:sans-serif; text-align:center; padding-top:20vh;">
    <h1>Ignition Engine is Running</h1>
    <p>Status: <span id="status" style="color:yellow">Initializing...</span></p>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/ignition.sw.js', { type: 'module' })
                .then(() => {
                    document.getElementById('status').textContent = 'Active (Ready to Ignite)';
                    document.getElementById('status').style.color = '#0f0';
                    console.log('Ignition Service Worker Registered');
                })
                .catch(err => {
                    document.getElementById('status').textContent = 'Store Error: ' + err;
                    document.getElementById('status').style.color = '#f00';
                });
        }
        
        // Example Usage
        // Ignition.Fuel({ engine: 'duckduckgo' });
    </script>
</body>
</html>`;
    fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
    console.log('Created dist/index.html');
}
