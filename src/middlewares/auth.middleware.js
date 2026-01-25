const passport = require('passport');

// Middleware para autenticación JWT
const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (error, user, info) => {
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
                    message: info?.message || 'No autorizado: Token inválido o inexistente'
                });
            }

            req.user = user;
            next();
        })(req, res, next);
    };
};

// Middleware para verificar roles
const authorization = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autorizado'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

module.exports = {
    passportCall,
    authorization
};
