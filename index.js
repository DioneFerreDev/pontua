require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const clienteRouter = require("./routes/clienteRouter");
const pannelRouter = require("./routes/pannelRouter");
const homeRouter = require("./routes/homeRouter");
const apiRouter = require("./routes/apiRouter");
const apiController = require('./controllers/apiController');
const authPannelController = require('./controllers/authPannelController');
const session = require("express-session");


// setando templates ejs
app.set("views", path.join(__dirname, "templatesViews/pages"));
app.set("view engine", "ejs")

app.use(session({ secret: process.env.SECRET_SESSION, resave: true, saveUninitialized: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "templatesViews/")));
app. use("/",homeRouter);
app.use("/cliente", clienteRouter);
app.use("/api",apiRouter);
app.use("/pannel",pannelRouter);

app.get("/unAuth", (req, res) => { res.render("unAuth") });

app.listen(process.env.PORT, () => {
    console.log(`RODANDO MEU PROJETO NA PORTA ${process.env.PORT}`)
})
