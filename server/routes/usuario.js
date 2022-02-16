const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const Historico = require('../models/historico');
const app = express();
const moment = require('moment');

//PETICIÓN POST PARA ENVIO DE ESCANEOS DE USUARIOS EXISTENTES A LA BD
app.post('/qr_data', function (req, res) {

	const getTime = () => {
	  const date = moment().subtract(5, 'hours')
	  const minute = date.minutes()

	  alert(date.subtract(minute, 'minutes').format('YYYY/MM/DD HH:mm:ss'))
	}

    var body = req.body

    Usuario.findOne({ _id: body.id_user })
        .exec((err, datos_usuario) => {

            var codigo = datos_usuario.codigo

            var historico = new Historico({

                creado: getTime(),
                id_user: body.id_user,
                id_admin: body.user_id,
                names_user: body.nombres,
                Lname_user: body.apellidos,
                user_code: codigo,

            });

            historico.save((err, historicoDB) => {

                if (err) {
                    return res.status(200).json({
                        ok: false,
                        err
                    });
                };

                res.json({
                    ok: true,
                    historico: historicoDB,
                    img: "https://uploadfiles-accesscur.s3.us-east-2.amazonaws.com/" + body.id_user + ".jpg",
                });

            });

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        });

});




//PETICIÓN GET PARA TRAER USUARIOS EXISTENTES EN LAS BD
app.get('/user', function (req, res) {

    // Controla desde que pagina envía la paginación
    //let desde = req.query.desde || 0;
    //desde = Number(desde);

    // Controla el limite de registros que se solicita por pagina
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find()
        // Entrega paginación por valor de 5 los datos en las consultas de busqueda
        //.skip(desde)
        //.limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    Total_usuarios: conteo
                });

            });

        });

});

//PETICIÓN GET PARA TRAER 1 ÚNICO USUARIO EXISTENTES EN LA BD
app.post('/user_one', function (req, res) {
    
    let id = req.param('id');
    let datos = req;
    
    Usuario.findById( id )
        .limit(1)
        .exec((err, usuarios, datos) => {

            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments((err) => {

                res.json({
                    ok: true,
                    usuarios,
                    'valor': 'lo que quiera' + id,
                    dato: datos,
                });

            });

        });

});


// PETICIÓN POST PARA REALIZAR LA CREACIÓN DE USUARIOS
app.post('/user/create', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({

        nombres: body.nombres,
        apellidos: body.apellidos,
        documento: body.documento,
        codigo: body.codigo,
        celular: body.celular,
        email: body.email,
        facultad: body.facultad,
        estado: body.estado,
        facultad: body.facultad,
        programa: body.programa,
        jornada: body.jornada,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        //usuario.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});





//PETICIÓN POST PARA REALIZAR EL CAMBIO DE CONTRASEÑA
app.post('/user/cambiarpassword/:id', function (req, res) {
    
    let body = req.body;
    let id = req.params.id;

    const user = {
        password: bcrypt.hashSync(body.password, 10),
    }
        
    Usuario.findByIdAndUpdate(id, user, { new: true }, (err, estadoUsuario) => {
    
        res.json({
            ok: true,
            message: 'Contraseña actualizada correctamente',
            estadoUsuario,
        });

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    });

});






//PETICIÓN POST PARA REALIZAR ACTUALIZACIÓN DE DATOS DE USUARIO
app.post('/user/update/:id', function (req, res) {
    
    let body = req.body;
    let id = req.params.id;

    const user = {
        // nombres     : req.body.nombres   || req.usuario.nombres,
        // apellidos   : req.body.apellidos || req.usuario.apellidos,
        // email       : req.body.email     || req.usuario.email,
        // celular     : req.body.celular   || req.usuario.celular,
        // role        : req.body.role      || req.usuario.role,
        // estado      : req.body.estado    || req.usuario.estado,
        // password    : req.body.password  || req.usuario.password
        password: bcrypt.hashSync(body.password, 10),
    }
        
    Usuario.findByIdAndUpdate(id, user, { new: true }, (err, estadoUsuario) => {
    
        res.json({
            ok: true,
            message: 'Contraseña actualizada correctamente',
            estadoUsuario,
        });

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    });

});

//PETICIÓN DELETE PARA REALIZAR INACTIVACIÓN DE USUARIOS
app.delete('/delete/:id', function (req, res) {
    let id = req.params.id;
    let cambiarEstado = {
        estado: 'INACTIVO'
    };

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, estadoUsuario) => {
        //Usuario.findByIdAndUpdate(id, { new: true }, ( err, estadoUsuario ) => {

        res.json({
            //ok: true,
            message: 'Se ha deshabilitado el usuario correctamente',
            usuario: estadoUsuario
        });

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    });

});

module.exports = app;
