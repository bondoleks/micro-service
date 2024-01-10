const getCommentsHandler = (req, res) => {
    res.send('Get Comments');
};

const postCommentsHandler = (req, res) => {
    res.send('Post Comments');
};

const getSingleCommentHandler = (req, res) => {
    res.send(`Single Comments ${req.params.commentId}`);
};

const deleteSingleCommentHandler = (req, res) => {
    res.send(`Delete Comments ${req.params.commentId}`);
};

module.exports = {
    getCommentsHandler,
    postCommentsHandler,
    getSingleCommentHandler,
    deleteSingleCommentHandler,
};
