//const mongoose = require('mongoose');
//const authorModel = require("../model/authorModel")
//const blogModel = require("../model/blogModel")





const createBooks = async function(req, res) {
    try {
        const data = req.body
            //  data validation

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { authorId, title, body, category, tags, subcategory, isPublished, isDeleted } = data

        // authorId validation

        if (!authorId) {
            return res.status(400).send({ status: false, msg: "authorId must be present" })
        }
        let idCheck = mongoose.isValidObjectId(authorId)
        console.log(idCheck)
        if (!idCheck) return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })

        const id = await authorModel.findById(authorId)
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
        if (typeof title !== "string" || title.trim().length === 0) return res.status(400)
            .send({ status: false, msg: "please enter valid title" });
        title = title.trim()

        // body validation
        if (!body || body === undefined) {
            return res.status(400).send({ status: false, msg: "body is not Given" })
        }
        if (typeof body !== "string" || body.trim().length === 0) return res.status(400)
            .send({ status: false, msg: "please enter valid body" });
        data.body = data.body.trim()

        // category validation
        if (!category || category === undefined) {
            return res.status(400).send({ status: false, msg: "category must be present" })
        }
        if (typeof category !== "string" || category.trim().length === 0) return res.send({ status: false, msg: "please enter valid category" })
        data.category = data.category.trim()

        // if isPublished key is present
        if (isPublished) {
            if (typeof isPublished !== "boolean") {
                return res.status(400)
                    .send({ status: false, msg: "isPublished is boolean so,it can be either true or false" })
            }
            if (isPublished === true)
                data.publishedAt = Date.now()
        }

        // // if isdeleted key is present
        if (isDeleted) {
            if (typeof isDeleted !== "boolean") {
                return res.status(400)
                    .send({ status: false, msg: "isDeleted is boolean so,it can be either true or false" })
            }
            if (isDeleted === true) { data.deletedAt = Date.now() }
        }

        // tags validation
        // if(typeof tags =="string") return res.status(400).send({})
        if (tags || typeof tags == "string") {

            if (!Array.isArray(tags)) return res.status(400).send({ status: false, msg: "tags should be  array" })

        }

        // subcategory validation

        if (subcategory || typeof tags == "string") {
            if (!Array.isArray(subcategory)) return res.status(400)
                .send({ status: false, msg: "subcategory should be array of strings" })


        }
        console.log(data)

        const check = await blogModel.findOne(data)
        console.log(check)
        if (check) return res.status(400).send({ status: false, msg: "this blog already exist" })

        // Blog Creation
        const Blog = await blogModel.create(data)
        return res.status(201).send({ status: true, data: Blog })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



//module.exports.createBlogs = createBlogs