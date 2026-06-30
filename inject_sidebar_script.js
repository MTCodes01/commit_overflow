const fs = require('fs');
const path = require('path');

const dir = 'd:\\Github\\commit_overflow';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const scriptToInject = `<body>\n<script>if(localStorage.getItem('sidebar-collapsed')==='true') document.body.classList.add('sidebar-collapsed');</script>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes("if(localStorage.getItem('sidebar-collapsed')==='true')")) {
    content = content.replace('<body>', scriptToInject);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
