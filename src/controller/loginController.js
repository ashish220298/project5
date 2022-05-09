const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");




const loginUser = async function(req, res) {
    try {
        if (!Object.keys(req.body).length === 0) return res.status(400).send({ status: false, msg: "Please enter  mail and password" })
        let userName = req.body.email
        let password = req.body.password;

        if (!userName || userName === undefined) {
            return res.status(400).send({ status: false, msg: "please enter email" })
        }
        if (!password || password === undefined) {
            return res.status(400).send({ status: false, msg: "please enter password" })
        }
        userName = userName.trim().toLowerCase()
        password = password.trim()
        let user = await userModel.findOne({ email: userName, password: password });
        if (!user)
            return res.status(404).send({ status: false, msg: "Please enter a valid email address and password" });

        let token = jwt.sign({
                authorId: user._id.toString(),
                group: "12",
                project: 4,
            },
            "project-4-group-12"
        );


        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, data: token });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}

module.exports.loginUser = loginUser