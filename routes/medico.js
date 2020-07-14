var express = require('express');
var mdAuthentication = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

/**=====================================
 * Obtener todos los hostipatales
 =======================================*/

app.get('/',(req,res,next)=> {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('hospital')
    .exec( (err,medicos) =>{

        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al cargar los medicos',
                errors: err
            })
        }

        Medico.count({}, (err,conteo) => {

            res.status(200).json({
                ok :true,
                medicos: medicos,
                total:conteo
            });

        });

    })
});

/**=====================================
 * Actualizar médicos
 =======================================*/

 app.put('/:id', mdAuthentication.verificaToken , (req,res,next) => {

    var idMedico = req.params.id;
    var body = req.body;

    Medico.findById(idMedico, (err, medicoEncontrado) => {
        if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al buscar médico',
                errors: err
            })};

        if( !medicoEncontrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'Medico con id ' + idMedico+ ' no existe',
                errors: { message: 'No existe el médico con ese ID' }
            });
        }

        medicoEncontrado.nombre   = body.nombre;
        medicoEncontrado.usuario  = req.usuario._id;
        medicoEncontrado.hospital  = body.hospital;

        medicoEncontrado.save( (err, medicoGuardado) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                medico:medicoGuardado
            })
        });
    });
  
 });


 /**=====================================
 * Crea el medico
 =======================================*/

 app.post('/',mdAuthentication.verificaToken, (req,res)=>{
     var body = req.body;
     var medico = new Medico({
         nombre: body.nombre,
         usuario: req.usuario._id,
         hospital: body.hospital
     });

     medico.save( (err,medicoGuardado) => {
        if(err){
            return res.status(400).json({
                ok :false,
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }

        res.status(201).json({
            ok :true,
            medico: medicoGuardado
        });
     })
 })

  /**=====================================
 * Borrar los medicos
 =======================================*/

 app.delete('/:id',mdAuthentication.verificaToken, (req,res) => {
     var idMedico = req.params.id;

     Medico.findByIdAndRemove(idMedico, (err, medicoBorrado) => {
         if(err){
            return res.status(500).json({
                ok :false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
         }

         if( !medicoBorrado ){
            return res.status(400).json({
                ok :false,
                mensaje: 'No existe el médico con el id '+ idMedico,
                errors: { message: 'No existe el médico con ese id'}
            });
        }

        res.status(200).json({
            ok :true,
            medico: medicoBorrado
        });

     })
 })


 module.exports = app;