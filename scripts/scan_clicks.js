const fs = require('fs');
const path = require('path');

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next') scan(full);
    } else if (f.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('<button') || l.includes('<a ') || l.includes('<Link ')) {
          const slice = lines.slice(i, Math.min(lines.length, i + 8)).join(' ');
          if (!slice.includes('onClick') && !slice.includes('href') && !slice.includes('type="submit"') && !slice.includes("type='submit'")) {
            console.log(full + ':' + (i + 1) + ' -> ' + l.trim());
          }
        }
      });
    }
  }
}
scan('components');
scan('app');
