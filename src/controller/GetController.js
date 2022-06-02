const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")





const getUserById = async function (req, res) {
    try {
        if (req.params.userId == undefined)
            return res.status(400).send({ status: false, message: "userId is required." });
        let userId = req.params.userId

        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "userId is not a type of objectId" })
            }
        }
        let check = await userModel.findOne({ _id: userId }).select()
        if (!check) {
            return res.status(400).send({ status: false, msg: "userId is not present or Already deleted" })
        }
        if (check.length === 0) {
            return res.status(404).send({ status: false, msg: "user not found" })
        }

        // const data = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 }).sort({ "reviewedBy": 1 })

        const user = await userModel.findById(userId).select({ address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1, createdAt: 1, updatedAt: 1 })

        // let doc = {
        //  Book: book,
        // reviewsData: data,
        // }
        return res.status(200).send({ status: true, message: "User Ditles", data: user })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}


const getproduct = async function (req, res) {
    try {
        let data1 = req.query
        if (data1.length === 0) {
            return res.status(404).send({ status: false, msg: "Product not found" })
        }
        let { size, name, priceGreaterThan, priceLessThan, sortPrice } = data1


        let filter = { isDeleted: false }
        if (name) {
            if (typeof name !== "string" || name.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid name" });
            const searchName = await productModel.find({ title: { $regex: name }, isDeleted: false }).sort({ price: sortPrice })
            console.log(searchName)
            if (searchName.length == 0) return res.status(400).send({ status: false, msg: `product not found with this ${name}` });
            filter["title"] = name

        }

        if (size) {
            if (typeof size !== "string" || size.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid size" });

            const searchSize = await productModel.find({ availableSizes: size, isDeleted: false }).sort({ price: sortPrice })

            if (searchSize.length == 0) return res.status(400).send({ status: false, msg: `product not found with this ${size}` });

            filter["availableSizes"] = size

        }

        if (priceGreaterThan != null && priceLessThan == null) {
            filter["price"] = { $gt: priceGreaterThan }
        }

        if (priceGreaterThan == null && priceLessThan != null) {
            filter["price"] = { $lt: priceLessThan }
        }

        if (priceGreaterThan != null && priceLessThan != null) {
            filter["price"] = { $gt: priceGreaterThan, $lt: priceLessThan }
        }

        //ascending(low to high)
        if (sortPrice == 1) {
            let findPrice = await productModel.find(filter).sort({ price: 1 })
            if (findPrice.length == 0) {
                return res.status(404).send({ status: false, message: "data not found" })
            }
            return res.status(200).send({ status: true, data: findPrice })
        }

        //descending(high to low)
        if (sortPrice == -1) {
            let findPrice = await productModel.find(filter).sort({ price: -1 })
            if (findPrice.length == 0) {
                return res.status(404).send({ status: false, message: "data not found" })
            }
            return res.status(200).send({ status: true, data: findPrice })
        }


        console.log(filter)

        let data = await productModel.find(filter)


        if (!data) {
            return res.status(400).send({ status: false, msg: "data not found" })
        }
        return res.status(200).send({ status: true, message: "Productlist List", data: data })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}


const getProductById = async function (req, res) {
    try {
        if (req.params.productId == undefined)
            return res.status(400).send({ status: false, message: "productId is required." });
        let productId = req.params.productId

        if (productId) {
            if (!mongoose.isValidObjectId(productId)) {
                return res.status(400).send({ status: false, msg: "productId is not a type of objectId" })
            } 
        }
        let check = await productModel.findOne({ _id: productId, isDeleted: false }).select()
        if (!check) {
            return res.status(400).send({ status: false, msg: "productId is not present or Already deleted" })
        }
        if (check.length === 0) {
            return res.status(404).send({ status: false, msg: "product not found" })
        }

       

        const product = await productModel.findById(productId)//.select({ address: 1, _id: 1, fname: 1, lname: 1, email: 1, profileImage: 1, phone: 1, password: 1, createdAt: 1, updatedAt: 1 })

        return res.status(200).send({ status: true, message: "Product Ditles", data: product })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports.getUserById = getUserById

module.exports.getproduct = getproduct

module.exports.getProductById = getProductById


