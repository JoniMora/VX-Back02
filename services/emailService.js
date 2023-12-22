const nodemailer = require('nodemailer')

const sendPasswordRecoveryEmail = async (userEmail, recoveryLink) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        // service: 'Gmail',
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,

            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_PASSWORD,
        },
    })

    const mailOptions = {
        from: `Developer Mora ${process.env.MAILTRAP_USER}`,
        //from: `Developer Mora ${process.env.GMAIL_USER}`,
        
        to: userEmail,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p><p>${recoveryLink}</p>`,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Correo electrónico enviado:', result)

    return result
}

module.exports = { sendPasswordRecoveryEmail }
