const express = require('express');
const router = express.Router();
const pannelController = require("../controllers/pannelController");
const authPannel = require("../controllers/authPannelController");


router.get("/", authPannel, pannelController.render);









module.exports = router;