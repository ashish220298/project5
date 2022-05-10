//const mongoose  = require('mongoose');

const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")






const updatebooks = async function(req, res) {

    try {
        let bookId = req.params.bookId;

        let data = req.body

        let { title, excerpt, ISBN } = data // destructuring



        // bookid Validation
        let idCheck = mongoose.isValidObjectId(bookId)

        if (!idCheck) return res.status(400).send({ status: false, msg: "bookId is not a type of objectId" })

        let status = await bookModel.findById(bookId)
        if (!status) return res.status(404).send({ msg: "this book is not present" })

        // authorization
        let token = req["userId"]

        if (status.userId != token) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
        if (status.isDeleted === true) return res.status(404).send({ status: false, msg: "this book is already deleted" })



        if (!(title || excerpt || ISBN)) {
            return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        }

        const updatebooks = await bookModel.findOneAndUpdate(bookId, {
            // $addToSet: { tags: tags, subcategory: subcategory },
            $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: Date.now() }
        }, { new: true });



        return res.status(200).send({ status: true, data: updatebooks });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}



module.exports.updatebooks = updatebooks