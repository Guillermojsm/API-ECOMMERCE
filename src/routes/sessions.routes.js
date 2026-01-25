const { Router } = require('express');
const { login, current } = require('../controllers/sessions.controller');
const { passportCall } = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/sessions/login - Login y generación de JWT
router.post('/login', login);

// GET /api/sessions/current - Obtener usuario actual (usa estrategia 'current')
router.get('/current', passportCall('current'), current);

module.exports = router;
