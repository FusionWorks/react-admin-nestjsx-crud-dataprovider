const fs = require('fs');

fs.copyFile('./src/index.d.ts', './dist/index.d.ts', (err) => {
  if (err) {
    throw err;
  }
  console.log('./src/index.d.ts was copied to destination folder.');
});