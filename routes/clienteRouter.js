const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

router.get("/", clienteController.render);
router.get("/authEmpresa/validarToken",clienteController.validarToken);
router.post("/AuthEmpresa/ClienteToken",clienteController.setarClienteToken);





module.exports = router;