const express = require('express');
const router = express.Router();
const admController = require("../controllers/admController");
const authPannel = require("../controllers/authPannelController");


router.get("/", authPannel.login, admController.render);
router.get("/authEmpresa/validarToken", authPannel.login, admController.validarToken);
// router.post("/authEmpresa/setarToken", admController.setarToken);







module.exports = router;