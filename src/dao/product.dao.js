const Product = require('../models/product.model');

class ProductDao {
    async create(data) {
        return Product.create(data);
    }

    async findAll() {
        return Product.find();
    }

    async findById(id) {
        return Product.findById(id);
    }

    async updateById(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async deleteById(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = ProductDao;
