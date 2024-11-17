const express = require('express');
const router = express.Router();
const apiController = require("../controllers/apiController");
const authPannel = require("../controllers/authPannelController");

// fazer o logout aqui
router.get("/logout", apiController.logout);
router.post("/login", apiController.login);
router.post("/create-user", authPannel, apiController.createUser);
router.get("/Empresa/Redirect", apiController.setarTokenCliente);
router.get("/puxar-produtos", authPannel, apiController.puxarProdutos);









module.exports = router;