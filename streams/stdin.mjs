import { Transform } from 'stream';
import fs from 'fs';

const upperCaseStream = new Transform({
    transform: function (chunk, encoding, cb) {
        const upperCased = chunk.toString().toUpperCase();
        cb(null, upperCased);
    },
});

const reverseCaseStream = new Transform({
    transform: function (chunk, encoding, cb) {
        const reverseCased = chunk.reverse().toString();
        cb(null, reverseCased);
    },
});

process.stdin
    .pipe(upperCaseStream)
    .pipe(reverseCaseStream)
    .pipe(process.stdout);

// const filePath = './files/index.txt';

// const writeStream = fs.createWriteStream(filePath);

// process.stdin.pipe(writeStream);
