

require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodeFetch = require("../templatesViews/classes/nodeFetch");
const session = require("express-session");

module.exports =
{
    render: (req, res) => {
        console.log('chegou na rota painnel para renderizar o admin')
        res.render("admin")
    },
    setarToken: async (req, res) => {
        try {
            const options = {
                expiresIn: "1m"
            }
            const token = jwt.sign({ cnpj: req.body.cnpj, nome: req.body.nome }, process.env.TOKEN_SECRET, options);
            console.log('criei o adm controller setar');
            console.log(token)
            res.cookie("authorization-adm-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 360000
            });
            // res.header("authorization-token", token);
            res.status(200).send("user logged");
        } catch (error) {
            console.log(error);
            res.status(401);
        }
    },
    login: async (req, res) => {
        console.log('tentando validar fazer o login adm no controller');
        try {
            const dados = req.body;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/${dados.user},${dados.password}`;
            let adm = new nodeFetch(URL)
            adm = await adm.manageFetch();
            console.log('apos pesquisar esse é o adm')
            console.log(adm)
            
            req.session.user = req.body.user
            
            
            const options = { expiresIn: "23h" }
            const token = jwt.sign({ user: adm.user, level: adm.isAdmin }, process.env.TOKEN_SECRET, options);
            res.cookie("authorization-pannel-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: (1000 * 60 * 60 * 23)
            })
            res.setHeader("Cache-Control", "no-store");            
            res.send({ log: true, redirect: "/pannel" });

        } catch (error) { console.log(error); res.send({ log: false }) }

    }

}