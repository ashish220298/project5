const mongoose = require('mongoose');

const bookModel = require("../model/bookModel")




const deletById = async(req, res) => {
    try {

        let data = req.params.bookId

        // bookId  validation
        let idCheck = mongoose.isValidObjectId(data)

        if (!idCheck) return res.status(400).send({ status: false, msg: "bookId is not a type of objectId" })

        let status = await bookModel.findById(data)
        if (!status) return res.status(404).send({ status: false, msg: "this book is not present" })


        // authorization
        let token = req["authorId"]
        if (status.authorId != token) {
            return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        }

        if (status.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "this book is already deleted" })
        }

        let deltebook = await bookModel.findByIdAndUpdate(data, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, msg: "this Book is deleted successfully", })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: "error", error: err.message })
    }
}


//const deletByProperty = async(req, res) => {
// try {
//   let data = req.query
//  console.log(data)

// const { category, tags, authorId, subcategory, isPublished } = data


//    let token = req["authorId"]

//   let document = {
//      isDeleted: false,
//     ...data
//  }


// if (Object.keys(data).length === 0 || Object.values(data).length === 0) {
//     return res.status(400).send({ status: false, msg: "plz enter the data" })
// }

//  if (authorId) {
//   if (!mongoose.isValidObjectId(authorId)) {
//      return res.status(400).send({ status: false, msg: "authorId is not a type of objectId" })
//   }
// }

// if (!(authorId || category || tags || subcategory || isPublished)) {
//     return res.status(404).send({ status: false, msg: "Plz enter valid data for deletion" })
//  }

//  let exist = await blogModel.findOne({ $and: [data, { isDeleted: false }] })
//  if (!exist) return res.status(404).send({ status: false, msg: "this blog doesn't exist" })

// authorization
//  if (exist.authorId != token) return res.status(403)
//     .send({ status: false, msg: "You are not authorized to access this data" })




//   let property = await blogModel.updateMany(document, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

//   res.status(200).send({ status: true, msg: property })
//  } catch (err) {
//     console.log(err.message)
//     res.status(500).send({ status: "error", error: err.message })
//  }
//}







module.exports.deletById = deletById

//module.exports.deletByProperty=deletByProperty