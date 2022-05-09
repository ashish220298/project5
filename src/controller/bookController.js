const mongoose = require('mongoose');
const userModel = require("../model/userModel")
const bookModel = require("../model/bookModel")





const createBooks = async function(req, res) {
    try {
        const data = req.body
            //  data validation

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { title, userId, excerpt, ISBN, category, subcategory, reviews, isDeleted } = data
        const check = await bookModel.findOne({ title: title, ISBN: ISBN })
        console.log(check)
        if (check) return res.status(400).send({ status: false, msg: "this book already exist" })
            // authorId validation

        if (!userId) {
            return res.status(400).send({ status: false, msg: "authorId must be present" })
        }
        let idCheck = mongoose.isValidObjectId(userId)
        console.log(idCheck)
        if (!idCheck) return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })

        const id = await userModel.findById(userId)
        if (!id) {
            return res.status(404).send({ status: false, msg: "this Author is not present." })
        }
        //  accessing the payload authorId from request
        let token = req["authorId"]

        //  authorization
        if (token != authorId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
        console.log(title)

        // title validation
        if (!title || title === undefined) {
            return res.status(400).send({ status: false, msg: "title is not given" })
        }
        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid title" });
        title = title.trim()


        // ISBN validation
        if (!ISBN.trim() || ISBN.trim() === undefined) {
            return res.status(400).send({ status: false, msg: "ISBN is not given" })
        }

        let ISBNN = /^[0-9-_]{0,20}$/.test(ISBN.trim())
        if (!ISBNN) {
            return res.status(400).send({ status: false, msg: "ISBN is ony number" })
        }
        let checking = await bookModel.find()
            // reviews Validation
        if (!reviews || reviews === undefined) {
            return res.status(400).send({ status: false, msg: "reviews is not given" })
        }

        let reviewss = /^[0-9\.]{0,5}$/.test(reviews)
        if (!reviewss) {
            return res.status(400).send({ status: false, msg: "Reviews is only 0 to 5" })
        }
        // body validation
        if (!excerpt.trim() || excerpt.trim() === undefined) {
            return res.status(400).send({ status: false, msg: "excerpt is not Given" })
        }
        if (typeof excerpt !== "string" || excerpt.trim().length === 0) return res.status(400)
            .send({ status: false, msg: "please enter valid excerpt" });
        data.excerpt = data.excerpt.trim()

        // category validation
        if (!category || category === undefined) {
            return res.status(400).send({ status: false, msg: "category must be present" })
        }
        if (typeof category !== "string" || category.trim().length === 0) return res.send({ status: false, msg: "please enter valid category" })
        data.category = data.category.trim()

        // if isdeleted key is present
        if (isDeleted) {

            if (typeof isDeleted !== "boolean") {
                return res.status(400).send({ status: false, msg: "isDeleted is boolean so,it can be either true or false" })
            }
            if (isDeleted === true) { data.deletedAt = Date.now() }

        }




        // subcategory validation

        if (subcategory || typeof tags == "string") {
            if (!Array.isArray(subcategory)) return res.status(400)
                .send({ status: false, msg: "subcategory should be array of strings" })


        }
        console.log(data)



        // Book Creation
        const Book = await bookModel.create(data)
        return res.status(201).send({ status: true, data: Book })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports.createBooks = createBooks