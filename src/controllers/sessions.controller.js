const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserRepository = require('../repositories/user.repository');
const UserDto = require('../dtos/user.dto');
const mailService = require('../services/mail.service');

const userRepository = new UserRepository();

const login = async (req, res, next) => {
    passport.authenticate('login', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Error interno del servidor',
                error: error.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'Credenciales inválidas'
            });
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
            token: token,
            payload: new UserDto(user)
        });
    })(req, res, next);
};

const current = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Usuario autenticado',
            payload: new UserDto(req.user)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener datos del usuario',
            error: error.message
        });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email requerido'
            });
        }

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await userRepository.setResetToken(email, token, expires);

        await mailService.sendPasswordResetEmail(email, token);

        res.status(200).json({
            status: 'success',
            message: 'Correo de recuperación enviado'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al solicitar recuperación de contraseña',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Token y nueva contraseña requeridos'
            });
        }

        const user = await userRepository.getUserByResetToken(token);
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token inválido o expirado'
            });
        }

        const isSamePassword = bcrypt.compareSync(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                status: 'error',
                message: 'La nueva contraseña no puede ser igual a la anterior'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await userRepository.updateUser(user._id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null
        });

        res.status(200).json({
            status: 'success',
            message: 'Contraseña restablecida exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al restablecer contraseña',
            error: error.message
        });
    }
};

module.exports = {
    login,
    current,
    requestPasswordReset,
    resetPassword
};
