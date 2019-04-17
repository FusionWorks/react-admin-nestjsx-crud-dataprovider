const fs = require('fs');

fs.copyFile('./package.json', './dist/package.json', (err) => {
  if (err) {
    throw err;
  }
  console.log('package.json was copied to destination folder.');
});