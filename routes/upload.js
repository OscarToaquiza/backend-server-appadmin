var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

app.use(fileUpload());

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
const usuario = require('../models/usuario');
var Usuario = require('../models/usuario');

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    //tipos de colecciones

    var tiposValidos = ['hospitales','medicos','usuarios'];
    if( tiposValidos.indexOf(tipo) < 0  ){ 
        return res.status(400).json({
            ok:false,
            mensaje: 'Tipo de coleccion no valda',
            errors: {message: 'Tipo de collecion no valida'}
        });

    }

        if( !req.files ){

            return res.status(400).json({
                ok:false,
                mensaje: 'No ha seleccioando un archivo',
                errors: {message: 'Debe seleccionar una imagen'}
            });
        }

        //Validaciones------------------------------------

        //Obtener el nombre de archivo
        var archivo = req.files.imagen;
        var nombreGen = archivo.name.split('.');
        var extensionArchivo = nombreGen[nombreGen.length -1 ];

        // Extensiones validas
        var extensionesValidas = ['png','jpg','jpeg','gif'];
        if( extensionesValidas.indexOf(extensionArchivo)  < 0){
            return res.status(400).json({
                ok:false,
                mensaje: 'Extension del archivo no valida',
                errors: {message: 'Las extendiones válidas son: ' + extensionesValidas.join(', ')}
            });
        }


        // Nombre de archivo perzonalizado
        var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
        //Mover al archivo a un path especificp.
        var path = `./uploads/${tipo}/${nombreArchivo}`;
        archivo.mv(path, err =>{

            if(err){
               return res.status(500).json({
                    ok:false,
                    mensaje: 'Error al mover al archivo',
                    errors: err
                });
            } 

            subirPorTipo( tipo, id, nombreArchivo, res )
            // res.status(200).json({
            //     ok :true,
            //     mensaje: 'Archivo movido',
            //     extensionArchivo: extensionArchivo
            // });
            
        });

        // 
})



function subirPorTipo( tipo, id, nombreArchivo, res ){

    //Uusario
    if(tipo === 'usuarios' ){

        Usuario.findById(id, (err, usuarioEncontrado) => {


            if(!usuarioEncontrado){
                return res.status(400).json({
                    ok :false,
                    mensaje: 'Usuario no existe',
                    errors: {message: 'Usuario no existe'}
                });
            }

            var pathViejo = './upload/usuarios' + usuarioEncontrado.img;

            // Si existe elimina la img anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo)
            }

            usuarioEncontrado.img = nombreArchivo;
            usuarioEncontrado.save( (err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                  return res.status(200).json({
                        ok :true,
                        mensaje: 'Imagen de usuario actualizado',
                        usuario: usuarioActualizado
                    });

            });


        });
        

    }

    if(tipo === 'medicos' ){

        Medico.findById(id, (err, medicoEncontrado) => {
            if(!medicoEncontrado){
                return res.status(400).json({
                    ok :false,
                    mensaje: 'Medico no existe',
                    errors: {message: 'Medico no existe'}
                });
            }
            var pathViejo = './upload/medicos' + medicoEncontrado.img;

            // Si existe elimina la img anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo)
            }

            medicoEncontrado.img = nombreArchivo;
            medicoEncontrado.save( (err, medicoActualizado) => {

                  return res.status(200).json({
                        ok :true,
                        mensaje: 'Imagen de medico actualizado',
                        medico: medicoActualizado
                    });

            });


        });
    }

    if(tipo === 'hospitales' ){
        Hospital.findById(id, (err, hospitalEncontrado) => {

            if(!hospitalEncontrado){
                return res.status(400).json({
                    ok :false,
                    mensaje: 'Hospital no existe',
                    errors: {message: 'Hospital no existe'}
                });
            }

            var pathViejo = './upload/hospitales' + hospitalEncontrado.img;

            // Si existe elimina la img anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo)
            }

            hospitalEncontrado.img = nombreArchivo;
            hospitalEncontrado.save( (err, hospitalActualizado) => {

                  return res.status(200).json({
                        ok :true,
                        mensaje: 'Imagen de medico actualizado',
                        hospital: hospitalActualizado
                    });

            });


        });
    }

}

module.exports = app;