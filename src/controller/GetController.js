//const  mongoose  = require('mongoose');

//const blogModel = require("../model/blogModel")





const getBlogs = async function(req, res) {
    try {
        let data1 = req.query

        const { authorId, category, tags, subcategory } = data1

        if (Object.keys(data1).length) {
            if (!(authorId || tags || category || subcategory)) return res.status(400)
                .send({ status: false, msg: "not a valid filter" })
        }

        if (authorId) {
            if (!mongoose.isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })
            }
        }

        let filter = { isDeleted: false, isPublished: true, ...data1 }

        let data = await blogModel.find(filter)
        if (data.length === 0) {
            return res.status(404).send({ status: false, msg: "Blogs not found" })
        }

        return res.status(200).send({ status: true, data: data })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}




//module.exports.getBlogs=getBlogs