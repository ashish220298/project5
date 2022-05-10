const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")





const getBooks = async function(req, res) {
    try {
        let data1 = req.query

        const { userId, category, subcategory } = data1

        if (Object.keys(data1).length) {
            if (!(userId || category || subcategory)) return res.status(400).send({ status: false, msg: "not a valid filter" })
        }

        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })
            }
        }
        let check = await userModel.findOne({ _id: userId }) //.select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
        if (!check) {
            return res.status(400).send({ status: false, msg: "userId is not present" })
        }

        let filter = { isDeleted: false, ...data1 }

        let data = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
        if (data1.length === 0) {
            return res.status(404).send({ status: false, msg: "Blogs not found" })
        }

        return res.status(200).send({ status: true, message: "Books List", data: data })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}




module.exports.getBooks = getBooks