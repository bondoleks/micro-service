import fs from 'fs';
import path from 'path'; // Додайте цей рядок

if (!process.argv[2] || !process.argv[3]) {
    console.log('Error');
    process.exit(0);
}

const fileName = process.argv[2];
const lines = parseInt(process.argv[3]);

if (isNaN(lines)) {
    console.log('Error numb');
    process.exit(0);
}

const writeStream = fs.createWriteStream(path.join('./files', fileName));

for (let i = 1; i < lines; i++) {
    // Замініть "index" на "i" тут
    writeStream.write(`${i}\n`);
}

writeStream.end(() => {
    console.log('Done');
});
