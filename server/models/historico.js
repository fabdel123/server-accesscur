const mongoose = require('mongoose');
// Plugin para no permitir las datos repetidos y hacerlos de forma única
//const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let historicoSchema = new Schema({

    // Esquema del modelo de los nombres del usuario
    names_user: {
        type: String,
    },

    // Esquema del modelo de los apellidos del personal del usuario
    Lname_user: {
        type: String,
    },
    
    // Esquema del modelo del codigo del usuario escaneado
    user_code: {
        type: String,
    },
    
    // Esquema del modelo de las fechas del historico
    creado: {
        type: Date,
    },
    
    
    id_user: {
        type: String,
    },
    
    
    id_admin: {
        type: String,
    },
    
});


module.exports = mongoose.model( 'Historico', historicoSchema );
