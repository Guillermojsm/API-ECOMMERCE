const jwt = require('jsonwebtoken');
const passport = require('passport');

// Login - genera JWT
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

        // Generar JWT con datos del usuario
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
            payload: {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });
    })(req, res, next);
};

// Current - obtiene datos del usuario logueado desde el JWT
const current = async (req, res) => {
    try {
        // req.user contiene los datos extraídos del JWT por la estrategia 'current'
        res.status(200).json({
            status: 'success',
            message: 'Usuario autenticado',
            payload: req.user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener datos del usuario',
            error: error.message
        });
    }
};

module.exports = {
    login,
    current
};
