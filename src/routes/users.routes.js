const { Router } = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/users.controller');
const { passportCall } = require('../middlewares/auth.middleware');

const router = Router();

// POST /api/users - Registro de usuario (público)
router.post('/', createUser);

// GET /api/users - Listar todos los usuarios (protegido)
router.get('/', passportCall('current'), getUsers);

// GET /api/users/:id - Obtener usuario por ID (protegido)
router.get('/:id', passportCall('current'), getUserById);

// PUT /api/users/:id - Actualizar usuario (protegido)
router.put('/:id', passportCall('current'), updateUser);

// DELETE /api/users/:id - Eliminar usuario (protegido)
router.delete('/:id', passportCall('current'), deleteUser);

module.exports = router;
