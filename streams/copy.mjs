import fs from 'fs';

const fileName = './files/first.txt';
const fileName2 = './files/firs-copy.txt';

const readStream = fs.createReadStream(fileName);
const writeStream = fs.createWriteStream(fileName2);

readStream.pipe(writeStream);

readStream.on('end', () => console.log('Read'));
writeStream.on('finish', () => console.log('finish'));
writeStream.on('close', () => console.log('write'));
