var jwt = require("jsonwebtoken"),
    knex = require("./knex");

function verifyToken(req, res, next) {
    var token = String(req.cookies.jwt);
    // headers["x-access-token"];
    if (!token)
        return res
            .status(403)
            .send({ auth: false, message: "No token provided." });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: "Failed to authenticate token.",
            });

        // if everything good, save to request for use in other routes
        req.user = { email: decoded.email, name: decoded.name };
        next();
    });
}

const generateToken = (email, name) => {
    const a = jwt.sign({ email, name }, process.env.SECRET, {
        expiresIn: "300s",
    });
    return a;
};

module.exports = { verifyToken, generateToken };
