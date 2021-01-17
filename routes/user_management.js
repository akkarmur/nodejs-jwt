const express = require("express");
const router = express.Router();
const knex = require("../helper/knex");
const Joi = require("joi"),
    { verifyToken, generateToken } = require("../helper/jwt");

const signup = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),

        email: Joi.string()

            .min(3)
            .max(30)
            .required(),

        mo_no: Joi.number().integer().required(),

        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });
    const data = {
        name: req.body.name,
        email: req.body.email,
        mo_no: req.body.mo_no,
        password: req.body.password,
    };
    try {
        const value = await schema.validateAsync(data);
        const userexist = await knex("register")
            .select("name")
            .where("email", data.email);
        if (userexist.length >= 1) {
            throw new Error("User alredy exist");
        }
        const result = await knex("register").insert(data);

        console.log(result);
        res.status(200).json({
            meta: {
                status: 1,
                message: `success`,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            meta: {
                status: 0,
                message: `${error}`,
            },
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await knex("register").select("*").where("email", email);
        if (user.length === 0) {
            throw new Error("User Not exist");
        } else {
            if (user[0].password === password) {
                let token = generateToken(user[0].email, user[0].role);
                res.status(200).json({auth:true,token})
                
            } else {
                throw new Error("Password not Valide");
            }
        }
    } catch (err) {
        res.status(403).json({
            msg: "anuthorized",
        });
    }
};

const user = (req, res) => {
    res.status(200).send(req.user)
};

//routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", verifyToken, user);
router.get("/logout", (req, res) => {
    req.logout();
    res.status(200).json({ msg: "logout" });
});


module.exports = router;
