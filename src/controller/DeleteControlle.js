const mongoose = require('mongoose');

const productModel = require("../model/productModel")
const userModel = require("../model/userModel")



const deletProductById = async(req, res) => {
    try {

        let data = req.params.productId

        // bookId  validation
        let idCheck = mongoose.isValidObjectId(data)

        if (!idCheck) return res.status(400).send({ status: false, msg: "productId is not a type of objectId" })

        let status = await productModel.findById(data)
        if (!status) return res.status(404).send({ status: false, msg: "this product is not present" })


        // authorization
        let token = req["authorId"]
        if (status.authorId != token) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }

        if (status.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "this product is already deleted" })
        }

        let delteProduct = await productModel.findByIdAndUpdate(data, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, msg: "this Book is deleted successfully",Data:delteProduct })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}
module.exports.deletProductById = deletProductById

