const comments = require('./data');
const fs = require('fs');

function getHome(req, res) {
    fs.readFile('./files/comment-form.html'),
        (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('500');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
        };
}

function getComments(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
}

function postComments(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    if (req.headers['content-type'] === 'application/json') {
        let commentJSON = '';
        req.on('data', (chunk) => (commentJSON += chunk));

        req.on('end', () => {
            try {
                comments.push(JSON.parse(commentJSON));
                res.statusCode = 201;
                res.end('Comments added successfully');
            } catch (error) {
                res.statusCode = 400;
                res.end('Invalid request');
            }
        });
    } else {
        res.statusCode = 400;
        res.end('Bad request');
    }
}

function handleNotFound(req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Page not found</h1>');
}

module.exports = {
    getComments,
    postComments,
    handleNotFound,
    getHome,
};
