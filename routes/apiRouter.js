const express = require('express');
const router = express.Router();
const apiController = require("../controllers/apiController");
const authPannel = require("../controllers/authPannelController");
const authCliente = require("../controllers/clienteController");

// fazer o logout aqui
router.get("/logout", apiController.logout);
router.get("/Empresa/Redirect", apiController.setarTokenCliente);
router.get("/puxar-produtos", authPannel, apiController.puxarProdutos);
router.get("/puxar-produtos-cliente", authCliente.validarToken, apiController.puxarProdutos);
router.get("/all-clientes", authPannel, apiController.allClientes);
router.get("/all-users", authPannel, apiController.allUsers);
router.post("/login", apiController.login);
router.post("/create-user", authPannel, apiController.createUser);
router.post("/cliente", authPannel, apiController.getHisCliente);
router.post("/nome-cpf", authPannel, apiController.saveNomeCPF);
router.post("/trocar-pontos", authPannel, apiController.trocarPontos);
router.post("/send-points", authPannel, apiController.sendPoints);
router.post("/cliente-roleta", authCliente.validarToken, apiController.clienteRoleta);
router.post("/salvar-produto", authPannel, apiController.salvarProduto);
router.post("/delete-produto", authPannel, apiController.deleteProduto);
router.post("/update-produto", authPannel, apiController.updateProduto);
router.post("/delete-user", authPannel, apiController.deleteUser);
router.post("/update-user", authPannel, apiController.updateUser);
router.post("/delete-cliente", authPannel, apiController.deleteCliente);
router.post("/update-roleta", authPannel, apiController.updateRoleta);
router.post("/cliente-CPF", authCliente.validarToken, apiController.clienteCPF);
// router.get("/cliente-create",authCliente.validarToken, apiController.createCliente);









module.exports = router;