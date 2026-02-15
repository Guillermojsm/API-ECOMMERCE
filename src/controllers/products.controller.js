const ProductRepository = require('../repositories/product.repository');

const productRepository = new ProductRepository();

const createProduct = async (req, res) => {
    try {
        const product = await productRepository.createProduct(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

const getProducts = async (_req, res) => {
    try {
        const products = await productRepository.getProducts();

        res.status(200).json({
            status: 'success',
            payload: products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productRepository.getProductById(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productRepository.updateProduct(id, req.body);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productRepository.deleteProduct(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
