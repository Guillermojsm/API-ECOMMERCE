const { Router } = require('express');
const { login, current, requestPasswordReset, resetPassword } = require('../controllers/sessions.controller');
const { passportCall } = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/sessions/login - Login y generación de JWT
router.post('/login', login);

// GET /api/sessions/current - Obtener usuario actual (usa estrategia 'current')
router.get('/current', passportCall('current'), current);

// POST /api/sessions/forgot-password - Solicitar reset de contraseña
router.post('/forgot-password', requestPasswordReset);

// POST /api/sessions/reset-password - Resetear contraseña
router.post('/reset-password', resetPassword);

module.exports = router;
