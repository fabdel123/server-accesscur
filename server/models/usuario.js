const mongoose = require('mongoose');

// Plugin para no permitir las datos repetidos y hacerlos de forma única
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: [ 'COORDINACION', 'DOCENTE', 'ESTUDIANTE', 'PERSONAL DE SEGURIDAD', 'SUPERVISOR DE SEGURIDAD'],
    message: '{VALUE} no es un rol válido'
};

 let estadosValidos = {
    values: [ 'ACTIVO', 'INACTIVO', 'APLAZADO', 'MATERIAS CULMINADAS', 'EGRESADO'],
    message: '{VALUE} no es un estado válido'
 };

let usuarioSchema = new Schema({

    // Esquema del modelo del o los nombres del usuario
    nombres: {
        type: String,
        required: [true, 'El/Los nombres del usuario son necesarios']
    },

    // Esquema del modelo del o los apellidos del usuario
    apellidos: {
        type: String,
        required: [true, 'El/Los apellidos del usuario son necesarios']
    },

    // Esquema del modelo del codigo del usuario
    codigo: {
        type: String,
        unique: true,
        required: [true, 'El codigo del usuario es necesario']
    },
    
  // Esquema del modelo del documento del usuario
    documento: {
        type: String,
        unique: true,
        required: [true, 'El documento del usuario es necesario']
    },

    // Esquema del modelo del correo del usuario
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo del usuario es necesario']
    },
    
    // Esquema del modelo del telefono del usuario
    celular: {
        type: String,
        required: [true, 'El telefono celular del usuario es necesario']
    },

    // Esquema del modelo de la contraseña del usuario
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    
    // Esquema del modelo del ROL del usuario
    role: {
        type: String,
        enum: rolesValidos
    },
    
    // Esquema del modelo del estado del usuario
    estado: {
        type: String,
        default: 'ACTIVO',
        enum: estadosValidos
    },
    
    // Esquema del modelo de la facultad del usuario
    facultad: {
        type: String,
    },
    
    // Esquema del modelo del programa del usuario
    programa: {
        type: String,
    },
    
    // Esquema del modelo de la jornada del usuario
    jornada: {
        type: String,
    },
    
    img_profile: {
        type: String,
        default: 'undefined.jpg'
    },
    
});

// Permite no devolver un valor en la contraseña del usuario
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};


// Plugin personalizado que arroja un mensaje de error al momento de hacer una petición con un objeto único en la BD
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' } );

module.exports = mongoose.model( 'Usuario', usuarioSchema );
