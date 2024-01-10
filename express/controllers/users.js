const getUsersHandler = (req, res) => {
    res.send('Get Users');
};
const postUsersHandler = (req, res) => {
    res.send('Post Users');
};
const getSingleUserHandler = (req, res) => {
    res.send(`Single Users ${req.params.userId}`);
};

module.exports = {
    getUsersHandler,
    postUsersHandler,
    getSingleUserHandler,
};
