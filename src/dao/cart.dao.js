const Cart = require('../models/cart.model');

class CartDao {
    async create(data) {
        return Cart.create(data);
    }

    async findById(id) {
        return Cart.findById(id).populate('products.product');
    }

    async updateById(id, data) {
        return Cart.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('products.product');
    }

    async deleteById(id) {
        return Cart.findByIdAndDelete(id);
    }
}

module.exports = CartDao;
