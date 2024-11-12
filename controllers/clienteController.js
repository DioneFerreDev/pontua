require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports =
{
    render: (req, res) => { res.render("cliente") },
    setarClienteToken: async (req, res) => {
        try {
            const options = {
                expiresIn: "1m"
            }
            const token = jwt.sign({ cnpj: req.body.cnpj, nome: req.body.nome }, process.env.TOKEN_SECRET, options);
            console.log('criei o cliente controller setar');
            console.log(token)
            res.cookie("authorization-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 360000
            })
            // res.header("authorization-token", token);
            res.status(200).send("user logged");
        } catch (error) {
            console.log(error);
            res.status(401);
        }
    },
    validarToken: async (req, res) => {
        console.log('tentando validar no controller')
        const token = req.cookies['authorization-token'] || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("access denied");
    
        try {
            const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);
            res.status(200).send(userVerified);
        } catch (error) {
            res.status(401).send("user expired");
        }
    }

}