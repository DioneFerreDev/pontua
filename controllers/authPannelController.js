const jwt = require("jsonwebtoken");

module.exports =
{
    login: async (req, res, next) => {
        console.log('tentando validar o adm no controller');
        const token = req.cookies['authorization-pannel-token'] || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("access denied");
    
        try {
            const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);
            // res.status(200).send(userVerified);
            console.log(userVerified);
            req.user = userVerified;                        
            next();
        } catch (error) {
            res.status(401).send("user expired");
        }
    },
    validarToken: async (req, res, next) => {
        console.log('tentando validar o adm no controller');
        const token = req.cookies['authorization-pannel-token'] || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("access denied");
    
        try {
            const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);
            // res.status(200).send(userVerified);
            console.log(userVerified);
            req.user = userVerified;                        
            next();
        } catch (error) {
            res.status(401).send("user expired");
        }
    }

}