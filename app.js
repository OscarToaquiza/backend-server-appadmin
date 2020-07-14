var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

// Body Parser
//Parce application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login'); 
var medicoRoutes = require('./routes/medico');
var hospitalRouter = require('./routes/hospital');
var busquedaRoute = require('./routes/busqueda');
var upluadRoute = require('./routes/upload');
var imgRoute = require('./routes/imagenes');

//BD
mongoose.connect('mongodb://localhost/hospitalDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;
    console.log("MongoDB: \x1b[32m%s\x1b[0m",'online');
});


//Rutas
app.use('/usuario',usuarioRoutes);
app.use('/medico',medicoRoutes);
app.use('/hospital',hospitalRouter);
app.use('/login',loginRoutes);
app.use('/busqueda',busquedaRoute);
app.use('/upload',upluadRoute);
app.use('/img',imgRoute);

app.use('/',appRoutes);


app.listen(3000, ()=>{
    console.log("Express Server corriendo el puerto 3000: \x1b[32m%s\x1b[0m",'online');
});