const fs = require('fs/promises');

fs.writeFile('./text.excel', '777')
    .then(() => console.log('done'))
    .then(() => fs.appendFile('./text.excel', '\n888'))
    .then(() => console.log('done'))
    .catch((err) => console.log(err));
