const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
const middleWare = require("../middleWare/auth")

const put = require("../controller/putController")
    //const dController = require("../controller/DeleteControlle")
const user = require("../controller/userController")
const post = require("../controller/bookController")
const get = require("../controller/GetController")
const postt = require("../controller/reviewController")



router.post("/register", user.createuser)

router.post("/login", loginController.loginUser)

router.post("/books", middleWare.validateToken, post.createBooks)

router.get("/books", get.getBooks)

router.put("/blooks/:bookId", middleWare.validateToken, put.updatebooks)

router.post("/books/:bookId/review", postt.reviewsData)

//router.delete("/blogs/:blogId", middleWare.validateToken, dController.deletById)

//router.delete("/blogs", middleWare.validateToken, dController.deletByProperty)








module.exports = router;