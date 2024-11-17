

require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodeFetch = require("../templatesViews/classes/nodeFetch");

module.exports =
{
    logout: async (req, res) => {
        try {
            console.log('chegou no rota logout')
            res.clearCookie('authorization-pannel-token', { path: '/', httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).send({ logout: true });
        } catch (error) {
            console.log(error);
            res.status(401).send({ logout: false });
        }
    },
    login: async (req, res) => {        
        try {
            const dados = req.body;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/${dados.user},${dados.password}`;
            let adm = new nodeFetch(URL)
            adm = await adm.manageFetch();
            // fazer aqui o set das session
            req.session.user = req.body.user;
            req.session.isAdmin = adm.isAdmin;
            // id provisório
            req.session.uuid = "804dcf6c-aa27-4a30-89d6-661574c29c58";
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

    },
    createUser: async (req, res) => {
        try {
            const URL_USER = "https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/Create";
            const user = req.body.user;
            const password = req.body.password;
            const dados = { user, password }
            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
            let resposta = new nodeFetch(URL_USER, options);
            resposta = await resposta.manageFetch();
            const msg = `resposta chegou com sucesso na API do create user com o use de ${user} e password de ${password}`;
            res.status(200).send(msg);
        } catch (error) {
            console.log(error);
            res.status(401).send({ logout: false });
        }
    },
    setarTokenCliente: async (req, res) => {
        try {
            const uuid = req.query.uuid;
            const URL_EMPRESA_AUTH = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Empresa/Redirect?uuid=${uuid}`;
            const resposta = await new nodeFetch(URL_EMPRESA_AUTH).manageFetch();

            if (!resposta === "OK") return res.redirect("/unAuth")

            const options = { expiresIn: "1m" }
            const token = jwt.sign({ nome: "Pontua Mais", id: uuid }, process.env.TOKEN_SECRET, options);
            res.cookie("authorization-cliente-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                maxAge: (5 * 60 * 1000)
            })            
            res.redirect("/cliente");
        } catch (error) {
            res.status(401).redirect("/unAuth");
        }
    },
    puxarProdutos: async (req, res) => {        
        try {            
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/ListAll`;
            const produtos = await new nodeFetch(URL).manageFetch();
            res.send(produtos);                                                

        } catch (error) { console.log(error); res.send({ }) }

    }

}