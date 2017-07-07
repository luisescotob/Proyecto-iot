//importar librerías

var express = require("express"); //framework para node.js que hace node mas fácil de escribir
var bodyParser = require("body-parser"); //para leer parámetros de una petición cuando es POST
var mongoose = require("mongoose"); //ORM para mongoDB
var config = require("./config"); //configuración del server
var morgan = require("morgan"); //hace un log de las requests en la consola
var path = require("path");

//crea la aplicación con express
var app = express();

//app.use(express.static((path.join(__dirname, './views/'))));


//asigna el puerto
var puerto = config.port;

//conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect(config.dataBaseUrl);

//incluir middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//middleare que loggea cada request en la consola
app.use(morgan("dev"));

//incluir middlewares
app.use(require("./middlewares"));



//incluir controllers
app.use(require("./controllers"));




//Inicia servidor
app.listen(process.env.PORT || puerto);
console.log("Aplicación escuchando en puerto "+puerto);



