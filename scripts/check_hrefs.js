const fs = require('fs');
const path = require('path');

function checkLinks(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') checkLinks(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
      for (const m of hrefMatches) {
        console.log(`${full} -> href: ${m[1]}`);
      }
    }
  }
}

checkLinks('components');
checkLinks('app');
