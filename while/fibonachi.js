setTimeout(() => console.log('Time'), 0);
function fib(n) {
    let x = 0;
    for (let i = 0; i <= n; i++) {
        x += i;
    }
    return x;
}

console.log(fib(30));
