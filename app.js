var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

// Body Parser
//Parce application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login'); 

//BD
mongoose.connect('mongodb://localhost/hospitalDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;
    console.log("MongoDB: \x1b[32m%s\x1b[0m",'online');
});


//Rutas
app.use('/usuario',usuarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);


app.listen(3000, ()=>{
    console.log("Express Server corriendo el puerto 3000: \x1b[32m%s\x1b[0m",'online');
});