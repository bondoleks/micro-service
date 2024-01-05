const fs = require('fs');
const dns = require('dns');

function timestamp() {
    return performance.now().toFixed(2);
}

console.log('888');

setTimeout(() => console.log('777', timestamp()), 2000);

setTimeout(() => {
    process.nextTick(() => console.log('test', timestamp()));
    console.log('555', timestamp());
}, 1000);

fs.writeFile('./test.txt', 'Hello Node.js', () => console.log('Done'));

Promise.resolve().then(() => console.log('333'));

process.nextTick(() => console.log('111', timestamp()));

setImmediate(() => console.log('immm', timestamp()));

dns.lookup('google.com', (err, adress, family) => {
    console.log('DNS 1 google.com', adress, timestamp());
});

console.log('888');

const test = require('./while/test.js');
