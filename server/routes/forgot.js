require('../config/config');

const express = require('express');
const nodemailer = require("nodemailer");
const Usuario = require('../models/usuario');
const app = express();

app.post('/forgot-password', function (req, res) {

    var body = req.body
    var correo = body.email
    var token = Math.floor(Math.random() * 10001)



    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            });
        }


        async function main() {

            let transporter = nodemailer.createTransport({
                host: "smtp.office365.com",
                port: 587,
                secure: false,
                // Autenticación del correo electronico del remitente
                auth: {
                    user: process.env.AUTH_SMTP,
                    pass: process.env.PASS_SMTP,
                },
            });

            await transporter.sendMail({
                from: '"Administración Access Control CUR" <no_responder_cur@outlook.com>',
                to: correo,
                subject: "Recuperación de contraseña - Access Control CUR",
                html:

                    ` "Puede recuperar su contraseña de acceso ingresando al siguiente enlace:
            <br> <p> El codigo de seguridad es: <b>" `+ token + ` "</b> </p>
            <br>
            <b>Corporación Universitaria Republicana</b>",
            `
            });

        }

        main().catch(console.error);

        res.json({
            ok: true,
            message: 'Correo enviado correctamente a:' + ' ' + correo,
            token: token,
            mail: correo,
            token_id: usuarioDB._id,
        });

    })

});

module.exports = app;
