const express = require('express');
const router = express.Router();
const apiController = require("../controllers/apiController");
const authPannel = require("../controllers/authPannelController");

// fazer o logout aqui
router.get("/logout", apiController.logout);
router.post("/login", apiController.login);









module.exports = router;