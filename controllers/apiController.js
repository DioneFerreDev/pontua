

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

    }

}