const fs = require('fs');
const path = require('path');

const [,,...args] = process.argv;

const slug = args.join(' ').replace(/\s+/g, '-').toLowerCase();
const blogPath = path.resolve('content/blog', slug);
if (fs.existsSync(blogPath)) {
  console.log('This draft already exists!')
} else {
  fs.mkdirSync(blogPath);
  fs.writeFileSync(
    `${blogPath}/index.md`,
    `
---
  title: ${args.join(" ")}
  description: 
  date: ${new Date().toISOString().slice(0, 10)}
  draft: true
---
  `.trim()
  )
}