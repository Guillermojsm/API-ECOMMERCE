const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/user.repository');

const userRepository = new UserRepository();

const initializePassport = () => {
    // Estrategia Local para Login
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await userRepository.getUserByEmail(email);

                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                const isValidPassword = bcrypt.compareSync(password, user.password);

                if (!isValidPassword) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Estrategia JWT para rutas protegidas
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };

    passport.use('jwt', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await userRepository.getUserById(jwt_payload.id);

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia "current" para validar usuario logueado
    passport.use('current', new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            // Extraemos los datos directamente del JWT
            const userData = {
                id: jwt_payload.id,
                email: jwt_payload.email,
                first_name: jwt_payload.first_name,
                last_name: jwt_payload.last_name,
                role: jwt_payload.role
            };

            return done(null, userData);
        } catch (error) {
            return done(error);
        }
    }));
};

module.exports = initializePassport;
