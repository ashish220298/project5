const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")







const reviewsData = async function(req, res) {
    try {

        let bookId = req.query.bookId
        let data1 = req.body

        const { reviewedBy, rating, review } = data1

        if (!Object.keys(data1).length) {
            return res.status(400).send({ status: false, msg: "enter some data" })
        }

        if (bookId) {
            if (!mongoose.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })
            }
        }
        let check = await bookModel.findOne({ bookId: bookId })
        if (!check) {
            return res.status(400).send({ status: false, msg: "bookId is not present" })
        }
        data1.bookId = check._id



        if (check.length === 0) {
            return res.status(404).send({ status: false, msg: "Book not found" })
        }


        let rev = await reviewModel.create(data1)

        let dataa = await reviewModel.find().select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        let dataaa = await reviewModel.find().count()
        let reviews = dataaa
        const updatebooks = await bookModel.findOneAndUpdate(bookId, {
            $set: { reviews: reviews }
        }, { new: true }).select()
        let doc = {
            data: updatebooks,
            reviewsData: dataa,


        }


        return res.status(200).send({ status: true, message: "Books List", data: doc })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}




module.exports.reviewsData = reviewsData