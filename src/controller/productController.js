//const mongoose = require('mongoose');
//const userModel = require("../model/userModel")
const productModel = require("../model/productModel")

//import currencySymbol from 'currency-symbol-map'
const aws = require("aws-sdk")
//const multer = require("multer");
//const { json } = require('express/lib/response');

// connect AWS
aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  //HERE
            Key: "Arijit/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"

    })
}




const createProduct = async function (req, res) {
    try {
        const data = req.body
        //  data validation  

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, isDeleted } = data
        // Book is same Book or not
        // if (typeof ISBN !== "string") {
        //  return res.status(400).send({ status: false, msg: "ISBN datatype should be string" })
        //    }

        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid title" });
        const check = await productModel.findOne({ title: title?.trim() })
        // console.table(check)
        if (check) return res.status(400).send({ status: false, msg: "this Product already exist" })
        // authorId validation


        // if (typeof userId !== "string") {
        // return res.status(400).send({ status: false, msg: "userId datatype should be string" })
        //  }

        //  let idCheck = mongoose.isValidObjectId(userId)
        // userId = userId?.trim()
        //console.log(idCheck)
        // if (!idCheck) return res.status(400).send({ status: false, msg: "userId is not a type of objectId" })

        //  const id = await userModel.findById(userId)
        // if (!id) {
        //  return res.status(404).send({ status: false, msg: "this user is not present." })
        // }
        //  accessing the payload authorId from request
        //let token = req["userId"]

        //  authorization
        // if (token != userId) {
        //  return res.status(403).send({ status: false, msg: "You are not authorized to access this data" })
        // }
        //console.log(title)

        // title validation
        if (!title || title === undefined) {
            return res.status(400).send({ status: false, msg: "title is not given" })
        }
        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid title" });
        title = title.trim()

        if (!description || description === undefined) {
            return res.status(400).send({ status: false, msg: "Description is not given" })
        }
        if (typeof description !== "string" || description.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid Description" });
        description = description.trim()


        // releasedAt validation
        if (!price || price === undefined) {
            return res.status(400).send({ status: false, msg: "releasedAt is not given" })
        }
        if (!(!isNaN(Number(price)))) return res.status(400).send({ status: false, msg: "please enter valid Price and Should be in Number" });


        if (price < 0) {
            return res.status(400).send({ status: false, msg: "Price Shoud be In Valid  Number only" })
        }


        // CurrencyId validation
        if (!currencyId || currencyId === undefined) {
            return res.status(400).send({ status: false, msg: "CurrencyId is not given" })
        }
        if (typeof description !== "string" || description.trim().length === 0) return res.status(400).send({ status: false, msg: "currencyId Should be in String" });

        if (currencyId.toUpperCase() != "INR") return res.status(400).send({ status: false, msg: "currencyId Only INR accepted " });

        currencyId = currencyId.toUpperCase()


        if (!currencyFormat || currencyFormat === undefined) {
            return res.status(400).send({ status: false, msg: "CurrencyFormat is not given" })
        }

        if (currencyFormat != "₹") {
            return res.status(400).send({ status: false, msg: "Only Indian Currency ₹ accepted" })
        }
        // ISBN validation

        // if (!isFreeShipping || isFreeShipping === undefined) {
        //  return res.status(400).send({ status: false, msg: "isFreeShipping is not given" })
        // }
        if (isFreeShipping) {
            let Shipping = JSON.parse(isFreeShipping)

            if (typeof Shipping !== 'boolean') {
                return res.status(400).send({ status: false, msg: "isFreeShipping should be in Boolen valus" })
            }
            data.isFreeShipping = Shipping
        }

        // let ISBNN = /^\d{3}-?\d{10}/.test(ISBN.trim())
        //   if (!ISBNN) {
        //return res.status(400).send({ status: false, msg: "ISBN is ony number and should be in format like XXX-XXXXXXXXXX" })
        // }
        //  data.ISBN = data.ISBN.trim()
        //reviews Validation
        // if (!reviews || reviews === undefined) {
        // return res.status(400).send({ status: false, msg: "reviews is not given" })
        //  }

        // let reviewss = /^[0]$/.test(reviews)
        // if (!reviewss) {
        // return res.status(400).send({ status: false, msg: "Reviews is only 0 when u created" })
        // }
        // body validation

        if (style) {

            if (typeof style !== "string" || style.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid style" });
            data.style = data.style.trim()
        }

        if (installments) {
            if (!(!isNaN(Number(installments)))) return res.status(400).send({ status: false, msg: "please enter valid installments and Should be in Number" });

            if (installments < 0) {
                return res.status(400).send({ status: false, msg: "installments Shoud be In Valid  Number only" })
            }
            data.installments = data.installments

        }

        console.log(typeof isDeleted)
        // if isdeleted key is present
        if (isDeleted) {

            let Del = JSON.parse(isDeleted)
            console.log(typeof Del)

            if (typeof Del !== "boolean") {
                return res.status(400).send({ status: false, msg: "isDeleted is boolean so,it can be either true or false" })
            }
            if (Del === true) { data.deletedAt = Date.now() }

            data.isDeleted = Del

        }




        //  availableSizes validation
        if (!availableSizes) return res.status(400).send({ status: false, msg: "availableSizes should be present" })

        if (availableSizes) {

            let siz = availableSizes.split(",")

            console.log

            // console.log(siz)
            if (!Array.isArray(siz)) return res.status(400).send({ status: false, msg: "availableSizes should be array of strings" })

            if (siz.some(sub => typeof sub === "string" && sub.trim().length === 0)) {
                return res.status(400).send({ status: false, message: " availableSizes should not be empty or with white spaces" })
            }

            let Size = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']
            const subtrim = siz.map(element => {
                return element.trim()

            })
            console.log(subtrim)
            for (const element of subtrim) {

                console.log(element)
                if (Size.includes(element) === false) return res.status(400).send({ status: false, msg: 'availableSizes should be  ["S", "XS", "M", "X", "L", "XXL", "XL"]' })

            }


            data.availableSizes = subtrim

        }

        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL
            // user Creation
            //const user = await userModel.create(data)
            // return res.status(201).send({ status: true, data: user })
            // res.status(201).send({ msg: "user productImage uploaded succesfully and user Creation Successfull", Data: user })
        }
        else {
            res.status(400).send({ msg: "No ProfileImage found" })
        }
        console.log(data)



        // Book Creation
        const product = await productModel.create(data)
        return res.status(201).send({ status: true, data: product })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}



module.exports.createProduct = createProduct