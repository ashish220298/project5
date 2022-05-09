const express = require('express');
const router = express.Router();


//const loginController = require("../controller/loginController")
//const middleWare = require("../middleWare/auth")

//const put = require("../controller/putController")
//const dController = require("../controller/DeleteControlle")
const user = require("../controller/userController")
    //const post = require("../controller/PostController")
    //const get = require("../controller/GetController")



router.post("/register", user.createuser)

//router.post("/login", loginController.loginUser)

//router.post("/blogs", middleWare.validateToken, post.createBlogs)

//router.get("/blogs", middleWare.validateToken, get.getBlogs)

//router.put("/blogs/:blogId", middleWare.validateToken, put.updateblogs)

//router.delete("/blogs/:blogId", middleWare.validateToken, dController.deletById)

//router.delete("/blogs", middleWare.validateToken, dController.deletByProperty)








module.exports = router;