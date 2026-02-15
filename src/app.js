require('dotenv').config({ path: '../.env' });

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const passport = require('passport');
const connectDB = require('./config/db.config');
const initializePassport = require('./config/passport.config');

// Importar rutas
const usersRoutes = require('./routes/users.routes');
const sessionsRoutes = require('./routes/sessions.routes');
const productsRoutes = require('./routes/products.routes');
const cartsRoutes = require('./routes/carts.routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Ruta de health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de rutas no encontradas
app.use('*', (_req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Manejo global de errores
app.use((error, _req, res, _next) => {
    console.error('Error:', error);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        error: error.message
    });
});

// Conectar a MongoDB e iniciar servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📚 Endpoints disponibles:`);
        console.log(`   - POST   /api/users          (Registro)`);
        console.log(`   - GET    /api/users          (Listar usuarios)`);
        console.log(`   - GET    /api/users/:id      (Obtener usuario)`);
        console.log(`   - PUT    /api/users/:id      (Actualizar usuario)`);
        console.log(`   - DELETE /api/users/:id      (Eliminar usuario)`);
        console.log(`   - POST   /api/sessions/login (Login)`);
        console.log(`   - GET    /api/sessions/current (Usuario actual)`);
    });
});

module.exports = app;
