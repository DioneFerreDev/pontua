const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authCliente = require("../controllers/authClienteController");

router.get("/", authCliente, clienteController.render);




module.exports = router;