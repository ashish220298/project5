const express = require('express');
const router = express.Router();


const loginController = require("../controller/loginController")
const middleWare = require("../middleWare/auth")
const put = require("../controller/putController")
const dController = require("../controller/DeleteControlle")
const user = require("../controller/userController")
const get = require("../controller/GetController")
const postt = require("../controller/productController")
const posttt = require("../controller/cartController")
const order = require("../controller/orderController")


// User APIs
router.post("/register", user.createuser)// 1

router.post("/login", loginController.loginUser)// 2

router.put("/user/:userId/profile", middleWare.validateToken, put.updateuser)// 3

router.get("/user/:userId/profile", get.getUserById)// 4


// Product APIs
router.post("/products", postt.createProduct)// 5

router.get("/products", get.getproduct)// 6

router.get("/products/:productId", get.getProductById)// 7

router.put("/products/:productId", put.updateProduct)// 8

router.delete("/products/:productId", dController.deletProductById)// 9


// Cart APIs
router.post("/users/:userId/cart", posttt.createCart)// 10

router.put("/users/:userId/cart", posttt.updateCart)// 11

router.get("/users/:userId/cart", posttt.getCart)//  12

router.delete("/users/:userId/cart", posttt.deleteCart)// 13


// Order APIs
router.post("/users/:userId/orders", order.createOrder)// 14

router.put("/users/:userId/orders", order.updateStatusOrder)// 15










module.exports = router;