//const mongoose  = require('mongoose');

///const blogModel = require("../model/blogModel")





const updateblogs = async function(req, res) {

    try {
        let blogId = req.params.blogId;

        let data = req.body

        let { title, body, tags, subcategory } = data // destructuring



        // blogid Validation
        let idCheck = mongoose.isValidObjectId(blogId)

        if (!idCheck) return res.status(400).send({ status: false, msg: "blogId is not a type of objectId" })

        let status = await blogModel.findById(blogId)
        if (!status) return res.status(404).send({ msg: "this blog is not present" })

        // authorization
        let token = req["authorId"]

        if (status.authorId != token) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }
        if (status.isDeleted === true) return res.status(404)
            .send({ status: false, msg: "this blog is already deleted" })



        if (!(title || body || tags || subcategory)) {
            return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        }

        const updateblogs = await blogModel.findByIdAndUpdate(blogId, {
            $addToSet: { tags: tags, subcategory: subcategory },
            $set: { title: title, body: body, isPublished: true, publishedAt: Date.now() }
        }, { new: true });



        return res.status(200).send({ status: true, data: updateblogs });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}



//module.exports.updateblogs=updateblogs