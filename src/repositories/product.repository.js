const ProductDao = require('../dao/product.dao');

class ProductRepository {
    constructor() {
        this.dao = new ProductDao();
    }

    async createProduct(data) {
        return this.dao.create(data);
    }

    async getProducts() {
        return this.dao.findAll();
    }

    async getProductById(id) {
        return this.dao.findById(id);
    }

    async updateProduct(id, data) {
        return this.dao.updateById(id, data);
    }

    async deleteProduct(id) {
        return this.dao.deleteById(id);
    }
}

module.exports = ProductRepository;
