const UserDao = require('../dao/user.dao');

class UserRepository {
    constructor() {
        this.dao = new UserDao();
    }

    async createUser(data) {
        return this.dao.create(data);
    }

    async getUserByEmail(email) {
        return this.dao.findByEmail(email);
    }

    async getUserById(id) {
        return this.dao.findById(id);
    }

    async getUsers() {
        return this.dao.findAll();
    }

    async updateUser(id, data) {
        return this.dao.updateById(id, data);
    }

    async deleteUser(id) {
        return this.dao.deleteById(id);
    }

    async setResetToken(email, token, expires) {
        return this.dao.setResetToken(email, token, expires);
    }

    async getUserByResetToken(token) {
        return this.dao.findByResetToken(token);
    }

    async clearResetToken(id) {
        return this.dao.clearResetToken(id);
    }
}

module.exports = UserRepository;
