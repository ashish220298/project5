const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
//const middleWare = require("../middleWare/auth")
const put = require("../controller/putController")
//const dController = require("../controller/DeleteControlle")
const user = require("../controller/userController")
//const post = require("../controller/bookController")
const get = require("../controller/GetController")
const postt = require("../controller/productController")



router.post("/register", user.createuser)

router.post("/login", loginController.loginUser)

//router.post("/books", middleWare.validateToken, post.createBooks)

router.post("/products", postt.createProduct)

router.get("/products", get.getproduct)

router.get("/user/:userId/profile", get.getUserById)

//router.put("/books/:bookId", middleWare.validateToken, put.updatebooks)

router.put("/user/:userId/profile", put.updateuser)

router.put("/products/:productId", put.updateProduct)


//router.delete("/books/:bookId", middleWare.validateToken, dController.deletById)

//router.delete("/books/:bookId/review/:reviewId", dController.reviewdelet)








module.exports = router;