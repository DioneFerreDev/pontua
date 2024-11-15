const jwt = require("jsonwebtoken");

module.exports = async function validarToken(req, res, next) {
    console.log('tentando validar o use no pannel no controller');
    const token = req.cookies['authorization-pannel-token'] || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).redirect("/unAuth");

    try {
        const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('usuario verificado com sucesso e token')
        console.log(token);
        console.log(userVerified);
        req.user = userVerified;
        next();
    } catch (error) {
        res.status(401).send("user expired");
    }
}



