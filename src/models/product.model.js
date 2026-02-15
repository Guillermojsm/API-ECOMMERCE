const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es requerido']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida']
    },
    code: {
        type: String,
        required: [true, 'El código es requerido'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido']
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido']
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida']
    },
    thumbnails: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
