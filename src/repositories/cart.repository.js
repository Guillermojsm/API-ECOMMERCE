const CartDao = require('../dao/cart.dao');

class CartRepository {
    constructor() {
        this.dao = new CartDao();
    }

    async createCart(data) {
        return this.dao.create(data);
    }

    async getCartById(id) {
        return this.dao.findById(id);
    }

    async updateCart(id, data) {
        return this.dao.updateById(id, data);
    }

    async deleteCart(id) {
        return this.dao.deleteById(id);
    }
}

module.exports = CartRepository;
