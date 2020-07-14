var express = require('express');
var mdAuthentication = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

/**=====================================
 * Obtener todos los hostipatales
 =======================================*/

app.get('/',(req,res,next)=> {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec( (err,hospitales) =>{
        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al cargar hospitales',
                errors: err
            })
        }

        Hospital.count({}, (err,conteo) => {

            
            res.status(200).json({
                ok :true,
                hospitales: hospitales,
                total:conteo
            });
            
        });
    })
});

/**=====================================
 * Actualizar hospitales
 =======================================*/

 app.put('/:id', mdAuthentication.verificaToken , (req,res,next) => {

    var idHospital = req.params.id;
    var body = req.body;

    Hospital.findById(idHospital, (err, hospitalEncontrado) => {
        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })};

        if( !hospitalEncontrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'Hospital con id ' + idHospital+ ' no existe',
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        hospitalEncontrado.nombre   = body.nombre;
        hospitalEncontrado.usuario  = req.usuario._id;

        hospitalEncontrado.save( (err,hospitalGuardado) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                hospital:hospitalGuardado
            })
        });
    });
  
 });


 /**=====================================
 * Crea los hospitales
 =======================================*/

 app.post('/',mdAuthentication.verificaToken, (req,res)=>{
     var body = req.body;
     var hospital = new Hospital({
         nombre: body.nombre,
         usuario:  req.usuario._id
     });

     hospital.save( (err,hospitalGuardado) => {
        if(err){
            return res.status(400).json({
                ok :false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok :true,
            hospital: hospitalGuardado
        });
     })
 })

  /**=====================================
 * Borrar los usuarios
 =======================================*/

 app.delete('/:id',mdAuthentication.verificaToken, (req,res) => {
     var idHospital = req.params.id;

     Hospital.findByIdAndRemove(idHospital, (err, hospitalBorrado) => {
         if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
         }

         if( !hospitalBorrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'No existe el hospital con ese id '+ idHospital,
                errors: { message: 'No existe el hospital con ese id'}
            });
        }

        res.status(200).json({
            ok :true,
            hospital: hospitalBorrado
        });

     })
 })


 module.exports = app;