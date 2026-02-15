const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user.repository');
const CartRepository = require('../repositories/cart.repository');
const UserDto = require('../dtos/user.dto');

const userRepository = new UserRepository();
const cartRepository = new CartRepository();

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        const newCart = await cartRepository.createCart({ products: [] });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await userRepository.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            cart: newCart._id,
            role: role || 'user'
        });

        const userResponse = new UserDto(newUser);

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

const getUsers = async (_req, res) => {
    try {
        const users = await userRepository.getUsers();
        const usersResponse = users.map(user => new UserDto(user));

        res.status(200).json({
            status: 'success',
            payload: usersResponse
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: new UserDto(user)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedUser = await userRepository.updateUser(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
            payload: new UserDto(updatedUser)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        if (user.cart) {
            await cartRepository.deleteCart(user.cart);
        }

        await userRepository.deleteUser(id);

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
