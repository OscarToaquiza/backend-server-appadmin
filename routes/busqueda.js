var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


/****************************************************
 * Busqueda por colección
 ******************************************************/


 app.get('/coleccion/:tabla/:busqueda', (req,res,next) => {

        var tabla = req.params.tabla;
        var busqueda = req.params.busqueda;

        var regex = new RegExp( busqueda, 'i' );
        
        var promesa;
        
        switch(tabla){
            case 'usuarios':
                promesa = buscarUsuario(busqueda, regex);
                break;
            case 'medicos':
                promesa = buscarMedicos(busqueda, regex);
                break;
            case 'hospitales':
                promesa = buscarHospitales(busqueda, regex);
                break;
            default:
                return res.status(400).json({
                    ok :false,
                    mensaje: 'Los tipos de busqueda son usuarios,medicos,hospitales',
                    error: { message: 'Tipo de tabla/coleccion no válido' }
                });

        }

        promesa.then(  resp => {
            res.status(200).json({
                ok :true,
                [tabla]: resp
            });
        })


 });


/****************************************************
 * Busqueda general
 ******************************************************/

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );
    console.log(regex)


    Promise.all(
        [
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ]
    ).then( resp => {
        
        res.status(200).json({
            ok :true,
            hospitales: resp[0],
            medicos: resp[1],
            usuarios: resp[2]
        });

    });     

});


function buscarHospitales( busqueda, regex ){
        
    return new Promise( (resolve, reject) => {
        Hospital.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .exec( (err,hospitales) => {
        
            if(err){
                reject('Error al cargar hospitales', err)
            }else{
                resolve(hospitales);
            }

        });

    });
    
}
    

function buscarMedicos( busqueda, regex ){
    
    return new Promise( (resolve, reject) => {
        Medico.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err,medicos) => {
        
            if(err){
                reject('Error al cargar hospitales', err)
            }else{
                resolve(medicos);
            }

        });

    });
    
}


function buscarUsuario( busqueda, regex ){
    
    return new Promise( (resolve, reject) => {
        Usuario.find({},'nombre email role')
            .or( [ {'nombre':regex},{'email':regex} ] )
            .exec( (err,usuarios) => {
                
                if(err){
                    reject('Error al cargar usuarios', err);
                }else{
                    resolve(usuarios);
                }


            });

    });
    
} 


module.exports = app;