const { rejects } = require('assert');
const { resolve } = require('path');

let isRunning = true;

setTimeout(() => (isRunning = false), 100);

function setImmediatePromise() {
    return new Promise((resolve, reject) => {
        setImmediate(() => resolve());
    });
}

async function whileLoop() {
    while (isRunning) {
        console.log('777');
        await setImmediatePromise();
    }
}

whileLoop().then(() => console.log('888'));
