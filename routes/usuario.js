var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutentication = require('../middlewares/autenticacion');

var app = express();


//var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');

/**=====================================
 * Obtener todos los usuarios
 =======================================*/


app.get('/', (req, res, next) => {

    //paginación.
    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
        .exec((err, usuarios) => {
            if(err){
                return res.status(500).json({
                    ok :false,
                    mensaje: 'Error al cargar usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) =>{

                
                res.status(200).json({
                    ok :true,
                    usuarios: usuarios,
                    total:conteo
                });
                
            });
   
    });
    
});


/**=====================================
 * Verofocar token
 =======================================*/

//  app.use('/', (req, res, next) =>{
//      var token = req.query.token;
//      jwt.verify( token, SEED, (err,decoded)=>{
//         if(err){
//             return res.status(401).json({
//                 ok :false,
//                 mensaje: 'Token no válido',
//                 errors: err
//             });
//         }
//         next();
//      });
//  });


/**=====================================
 * Actualizar los usuarios
 =======================================*/

 app.put('/:id', mdAutentication.verificaToken,(req,res,next) => {

     var idUsuario = req.params.id;
     var body = req.body;

    Usuario.findById(idUsuario, (err, usuarioEncontrado)=>{
        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if( !usuarioEncontrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'Usuario con id ' + idUsuario+ ' no existe',
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        
        console.log(usuarioEncontrado);
        console.log(body);
        usuarioEncontrado.nombre = body.nombre ;
        usuarioEncontrado.email = body.email ;
        usuarioEncontrado.role = body.role ;

        usuarioEncontrado.save( (err, usuariosGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                usuario: usuariosGuardado
            })

        } );

    })

 });


/**=====================================
 * Crea los usuarios
 =======================================*/
 app.post('/', mdAutentication.verificaToken ,(req,res)=> {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync( body.password , 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err,usuariosGuardado) =>{
        if(err){
            return res.status(400).json({
                ok :false,
                mensaje: 'Error al crear al usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok :true,
            usuario: usuariosGuardado,
            usuariotoken: req.usuario
        });

    });

 });


 /**=====================================
 * Borrar los usuarios
 =======================================*/

app.delete('/:id', mdAutentication.verificaToken, (req,res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if( !usuarioBorrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'No existe el usuario con ese id',
                errors: { message: 'No existe el usuario con ese id'}
            });
        }

        res.status(200).json({
            ok :true,
            usuario: usuarioBorrado
        });
    } );

});
module.exports = app;