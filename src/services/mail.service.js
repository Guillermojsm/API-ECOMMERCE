const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    return transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: email,
        subject: 'Restablecer contraseña',
        html: `
            <div>
                <p>Solicitaste restablecer tu contraseña.</p>
                <p>Este enlace expira en 1 hora.</p>
                <a href="${resetLink}" style="padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">Restablecer contraseña</a>
            </div>
        `
    });
};

module.exports = {
    sendPasswordResetEmail
};
