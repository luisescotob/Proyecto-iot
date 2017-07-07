var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");


//habilita permisos a las peticiones
router.use(require("./permissions"));

//middleware que envía los archivos estáticos HTML según la petición
router.use(require("./sendView"));

//solicita token de acceso a las ruta con prefijo /api/
//router.use("/api",require("./authentication"));
//solicita token de acceso a las rutas con prefijo /dashboard/
//router.use("/dashboard",require("./authentication"));






module.exports = router;