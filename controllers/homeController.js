

module.exports =
{
    render: (req, res) => { res.render("home") },
    login: async (req, res, next) => {
        console.log('tentando validar o adm no controller');
        const token = req.cookies['authorization-pannel-token'] || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("access denied");
    
        try {
            const userVerified = await jwt.verify(token, process.env.TOKEN_SECRET);            
            console.log(userVerified);
            req.user = userVerified;                        
            next();
        } catch (error) {
            res.status(401).send("user expired");
        }
    }    
}