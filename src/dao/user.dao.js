const User = require('../models/user.model');

class UserDao {
    async create(data) {
        return User.create(data);
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async findById(id) {
        return User.findById(id).populate('cart');
    }

    async findAll() {
        return User.find().populate('cart');
    }

    async updateById(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('cart');
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }

    async setResetToken(email, token, expires) {
        return User.findOneAndUpdate(
            { email },
            { resetToken: token, resetTokenExpires: expires },
            { new: true }
        );
    }

    async findByResetToken(token) {
        return User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    }

    async clearResetToken(id) {
        return User.findByIdAndUpdate(id, { resetToken: null, resetTokenExpires: null }, { new: true });
    }
}

module.exports = UserDao;
