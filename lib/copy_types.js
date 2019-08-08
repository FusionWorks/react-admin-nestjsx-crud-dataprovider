const fs = require('fs');

fs.copyFile('./src/index.d.ts', './dist/index.d.ts', (err) => {
  if (err) {
    throw err;
  }

  fs.copyFile('./src/interfaces.d.ts', './dist/interfaces.d.ts', (err) => {
    if (err) {
      throw err;
    }
  
    
    console.log('./src/interfaces.d.ts was copied to destination folder.');
  });
});