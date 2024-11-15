

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
        console.log('tentando validar fazer o login adm no controller');
        try {
            const dados = req.body;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/${dados.user},${dados.password}`;
            let adm = new nodeFetch(URL)
            adm = await adm.manageFetch();
            // fazer aqui o set das session
            req.session.user = req.body.user;
            req.session.isAdmin = adm.isAdmin;
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
            resposta = resposta.manageFetch();
            const msg = `resposta chegou com sucesso na API do create user com o use de ${user} e password de ${password}`;
            console.log(resposta);
            console.log(msg);
            res.status(200).send(msg);
        } catch (error) {
            console.log(error);
            res.status(401).send({ logout: false });
        }
    }

}