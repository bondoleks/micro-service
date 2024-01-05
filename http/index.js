const http = require('http');
const {
    getComments,
    postComments,
    handleNotFound,
    getHome,
} = require('./handle');
const PORT = 8080;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        return getHome(req, res);
    }
    if (req.method === 'GET' && req.url === '/comments') {
        return getComments(req, res);
    }
    if (req.method === 'POST' && req.url === '/comments') {
        return postComments(req, res);
    }
    if (req.url === '/http') {
        return res.end('test');
    }
    if (req.url === '/text') {
        return res.end('text');
    }
    handleNotFound(req, res);
});

server.listen(PORT, () => {
    console.log(`Start ${PORT}`);
});
