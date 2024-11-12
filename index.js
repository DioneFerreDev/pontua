require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const clienteRouter = require("./routes/clienteRouter");
const admRouter = require("./routes/admRouter");
const homeRouter = require("./routes/homeRouter");
const apiRouter = require("./routes/apiRouter");
const apiController = require('./controllers/apiController');
const authPannelController = require('./controllers/authPannelController');


// setando templates ejs
app.set("views", path.join(__dirname, "templatesViews/pages"));
app.set("view engine", "ejs")

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "templatesViews/")));
app. use("/",homeRouter);
app.use("/cliente", clienteRouter);
// app.use("/adm", admRouter);
app.use("/api",apiRouter);
app.get("/pannel", (req,res) => {    
    console.log("chegou na  rota novamente pannel")
    console.log(req.session)
    res.render("admin");   
})
app.get("/unAuth", (req, res) => { res.render("unAuth") });

app.listen(process.env.PORT, () => {
    console.log(`RODANDO MEU PROJETO NA PORTA ${process.env.PORT}`)
})
