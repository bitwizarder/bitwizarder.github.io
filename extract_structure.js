const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, 'project_dump.txt');

// فایل‌ها و پوشه‌هایی که نباید خوانده شوند
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'out', 'dist'];
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.mp3', '.mp4'];
const ALLOWED_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md'];

let outputContent = '';

function readDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (IGNORE_DIRS.includes(file)) continue;
            readDir(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            
            // فقط فایل‌های متنی و کد را بخوان
            if (ALLOWED_EXTS.includes(ext) && !IGNORE_EXTS.includes(ext)) {
                // اگر در پوشه public بود و عکس بود، فقط اسمش را لیست کن
                if (dir.includes('public') && IGNORE_EXTS.includes(ext)) continue;

                const relativePath = path.relative(ROOT_DIR, fullPath);
                const content = fs.readFileSync(fullPath, 'utf8');

                outputContent += `\n${'='.repeat(80)}\n`;
                outputContent += `FILE: ${relativePath}\n`;
                outputContent += `${'='.repeat(80)}\n\n`;
                outputContent += content;
                outputContent += '\n\n';
            }
        }
    }
}

console.log('⏳ در حال استخراج ساختار پروژه...');
readDir(ROOT_DIR);
fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
console.log(`✅ تمام شد! فایل خروجی در مسیر زیر ساخته شد:\n${OUTPUT_FILE}`);