const jwt = require("jsonwebtoken");

module.exports = async function validarToken(req, res, next) {    
    const token = req.cookies['authorization-cliente-token'];
        if (!token) return res.status(401).redirect("/unAuth");

        try {
            const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);
            next();
        } catch (error) {
            res.status(401).redirect("/unAuth");
        }    
}