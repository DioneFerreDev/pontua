

module.exports =
{
    render: (req, res) => { res.render("home") },
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
    login: async (req, res) => {
        console.log('tentando validar fazer o login adm no controller');
        try {
            // const dados = req.body;
            // const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/${dados.user},${dados.password}`;
            // let adm = new nodeFetch(URL)
            // adm = await adm.manageFetch();
            // const options = { expiresIn: "23h" }
            // const token = jwt.sign({ user: adm.user, level: adm.isAdmin }, process.env.TOKEN_SECRET, options);
            // res.cookie("authorization-pannel-token", token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     maxAge: (1000 * 60 * 60 * 23)
            // })  
            res.setHeader("Cache-Control", "no-store");
            // res.redirect("/pannel");
            console.log("redirecionar para a rota painnel")
            res.redirect("/painnel");                                                       
        } catch (error) { console.log(error) }

    }

}