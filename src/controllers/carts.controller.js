const crypto = require('crypto');
const CartRepository = require('../repositories/cart.repository');
const ProductRepository = require('../repositories/product.repository');
const TicketRepository = require('../repositories/ticket.repository');

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getCartById(cid);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener carrito',
            error: error.message
        });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartRepository.getCartById(cid);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        const product = await productRepository.getProductById(pid);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        const existingItem = cart.products.find(item => {
            const productId = item.product._id ? item.product._id.toString() : item.product.toString();
            return productId === pid;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        const updatedCart = await cartRepository.updateCart(cid, { products: cart.products });

        res.status(200).json({
            status: 'success',
            message: 'Producto agregado al carrito',
            payload: updatedCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al agregar producto al carrito',
            error: error.message
        });
    }
};

const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (req.user?.cart && req.user.cart.toString() !== cid) {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permisos para comprar este carrito'
            });
        }

        const cart = await cartRepository.getCartById(cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        let amount = 0;
        const purchasedProducts = [];
        const notPurchasedProducts = [];

        for (const item of cart.products) {
            const productData = item.product._id ? item.product : await productRepository.getProductById(item.product);

            if (!productData) {
                notPurchasedProducts.push({ product: item.product, quantity: item.quantity });
                continue;
            }

            if (productData.stock >= item.quantity) {
                const updatedStock = productData.stock - item.quantity;
                await productRepository.updateProduct(productData._id, { stock: updatedStock });
                amount += productData.price * item.quantity;
                purchasedProducts.push({ product: productData._id, quantity: item.quantity });
            } else {
                notPurchasedProducts.push({ product: productData._id, quantity: item.quantity });
            }
        }

        await cartRepository.updateCart(cid, { products: notPurchasedProducts });

        let ticket = null;
        if (purchasedProducts.length > 0) {
            ticket = await ticketRepository.createTicket({
                code: crypto.randomUUID(),
                amount: amount,
                purchaser: req.user.email
            });
        }

        res.status(200).json({
            status: 'success',
            payload: {
                ticket,
                notPurchasedProducts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar compra',
            error: error.message
        });
    }
};

module.exports = {
    getCartById,
    addProductToCart,
    purchaseCart
};
