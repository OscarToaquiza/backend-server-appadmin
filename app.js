const { request } = require('express');
var express = require('express');
var mongoose = require('mongoose');
var app = express();

//Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok :true,
        mensaje: 'Peticion realizada correctamente'
    });

})

//BD
mongoose.connect('mongodb://localhost/hospitaldb', {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;
    console.log("MongoDB: \x1b[32m%s\x1b[0m",'online');
});

app.listen(3000, ()=>{
    console.log("Express Server corriendo el puerto 3000: \x1b[32m%s\x1b[0m",'online');
});