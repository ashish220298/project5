const mongoose = require('mongoose');
const userModel = require("../model/userModel")
//const bookModel = require("../model/bookModel")
//const reviewModel = require("../model/reviewModel")




const getBooks = async function (req, res) {
    try {
        let data1 = req.query
        if (data1.length === 0) {
            return res.status(404).send({ status: false, msg: "Book not found" })
        }
        let { userId, category, subcategory } = data1
        let data2 = {}

        //  if (Object.keys(data1).length === 0) {
        // if (!(userId || category || subcategory)) return res.status(400).send({ status: false, msg: "not a valid filter" })


        if (userId) {
            data2.userId = userId.trim()
            if (!mongoose.isValidObjectId(data2.userId)) {
                return res.status(400).send({ status: false, msg: "userId is not a type of objectId" })
            }
        }
        if (category)
            data2.category = category.trim()
        if (subcategory)
            data2.subcategory = subcategory.trim()


        //let filter = { isDeleted: false, $or: [{ userId: userId }, { category: category }, { subcategory: subcategory }] }

        let data = await bookModel.find({
            $and: [{ isDeleted: false, ...data2 }],
        }).select({ bookId: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 });

        if (!data) {
            return res.status(400).send({ status: false, msg: " not valied" })
        }
        return res.status(200).send({ status: true, message: "Books List", data: data })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}



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




//module.exports.getBooks = getBooks

module.exports.getUserById = getUserById