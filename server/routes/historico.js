const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Historico = require('../models/historico');
const app = express();

//PETICIÓN GET PARA TRAER EL HISTORICO EXISTENTE DE LOS ESCANEOS EN LA BD
   app.get('/historical', function (req, res)  {

            Historico.find()
            .exec( (err, historicos) => {

                if ( err ) {
                   return res.status( 400 ).json({
                    ok: false,
                    err
                });
            }
            Historico.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    historicos,
                    Total_registros: conteo
            });

            });

    });

});


module.exports = app;
