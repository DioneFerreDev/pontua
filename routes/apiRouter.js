const express = require('express');
const router = express.Router();
const apiController = require("../controllers/apiController");
const authPannel = require("../controllers/authPannelController");


router.post("/login", apiController.login);
router.get("/adm", authPannel.login, apiController.render);
// router.get("/painnel", apiController.render);








module.exports = router;