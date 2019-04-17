const fs = require('fs');

fs.copyFile('./README.md', './dist/README.md', (err) => {
  if (err) {
    throw err;
  }
  console.log('README.md was copied to destination folder.');
});