

require("dotenv").config();
// const jwt = require("jsonwebtoken");

module.exports =
{
    render: (req, res) => {
        const data = { user: req.session.user, isAdmin: req.session.isAdmin, empresaId: req.session.uuid }
        res.render("admin", data);
    }

}