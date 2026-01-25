const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

// Crear usuario (registro)
const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        // Crear carrito para el usuario
        const newCart = await Cart.create({ products: [] });

        // Hashear password con bcrypt.hashSync
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear usuario
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id,
            role: role || 'user'
        });

        // Respuesta sin password
        const userResponse = {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            cart: newUser.cart,
            role: newUser.role
        };

        res.status(201).json({
            status: 'success',
            message: 'Usuario creado exitosamente',
            payload: userResponse
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('cart');
        
        res.status(200).json({
            status: 'success',
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password').populate('cart');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Si se actualiza password, hashearlo
        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
            payload: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Eliminar carrito asociado
        if (user.cart) {
            await Cart.findByIdAndDelete(user.cart);
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
