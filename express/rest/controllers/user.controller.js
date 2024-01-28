const db = require('../db');

class UserController {
    async createUser(req, res) {
        const { name } = req.body;
        console.log(name);
        res.json('ok');
    }

    async getUser(req, res) {
        const id = req.params.id;
        const user = await db.query('SELECT * FROM mcuser where id = $1', [id]);
        res.json(user.rows[0]);
    }

    async getUsers(req, res) {
        const users = await db.query('SELECT * FROM mcuser');
        res.json(users.rows);
    }

    async updateUser(req, res) {
        const { id, email } = req.body;
        const user = await db.query(
            'UPDATE mcuser set email = $1 where id = $2 RETURNING *',
            [email, id]
        );
        res.json(user.rows[0]);
    }

    async deleteUser(req, res) {}
}

module.exports = new UserController();
