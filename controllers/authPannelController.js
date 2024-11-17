const jwt = require("jsonwebtoken");

module.exports = async function validarToken(req, res, next) {    
    const token = req.cookies['authorization-pannel-token'] || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).redirect("/unAuth");

    try {
        const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);        
        req.user = userVerified;
        next();
    } catch (error) {
        res.status(401).redirect("/unAuth");
    }
}



