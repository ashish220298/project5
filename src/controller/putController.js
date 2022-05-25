const mongoose = require('mongoose');
const userModel = require("../model/userModel")
//const bookModel = require("../model/bookModel")
//const reviewModel = require("../model/reviewModel")
const productModel = require("../model/productModel")
const bcrypt = require("bcrypt")
const aws = require("aws-sdk")
const multer = require("multer");
const { json } = require('express/lib/response');

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
            // console.log(data)
            //  console.log("file uploaded succesfully")
            return resolve(data.Location)
        })

        // let data= await s3.upload( uploadParams)
        // if( data) return data.Location
        // else return "there is an error"

    })
}




const updatebooks = async function (req, res) {

    try {
        let bookId = req.params.bookId;

        let data = req.body

        let { title, excerpt, ISBN, releasedAt } = data // destructuring



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


        if (!(title || excerpt || ISBN || releasedAt)) {
            return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        }


        if (title) {
            if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid title" });
            const titleCheck = await bookModel.findOne({ title: title.trim() }) //.collation({ locale: 'en', strength: 2 })
            if (titleCheck) {
                return res.status(400).send({ status: false, message: " this title already exist " })
            }


        }
        if (excerpt) {
            if (typeof excerpt !== "string" || excerpt.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid excerpt" });

        }
        if (ISBN) {
            if (typeof ISBN !== "string") return res.status(400).send({ status: false, msg: "ISBN should have string datatype" });
            if (!/^\d{3}-?\d{10}/.test(ISBN.trim())) {
                return res.status(400).send({ status: false, message: "  please enter valid ISBN " })
            }
            const ISBNCheck = await bookModel.findOne({ ISBN: ISBN.trim() })
            if (ISBNCheck) {
                return res.status(400).send({ status: false, message: " this ISBN already exist " })
            }
        }

        if (releasedAt) {
            if (typeof releasedAt !== "string" || releasedAt.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid releasedAt and Should be in String" });

            let releasedAtt = /^^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt.trim())
            if (!releasedAtt) {
                return res.status(400).send({ status: false, msg: " releasedAt YYYY/MM/DD Format or Enter A valied Date " })
            }



        }

        const updatebooks = await bookModel.findOneAndUpdate({ _id: bookId }, {
            // $addToSet: { tags: tags, subcategory: subcategory },
            $set: { title: title?.trim(), excerpt: excerpt?.trim(), ISBN: ISBN?.trim(), releasedAt: releasedAt?.trim() }
        }, { new: true });



        return res.status(200).send({ status: true, data: updatebooks });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}

const updateuser = async function (req, res) {

    try {
        if (req.params.userId == undefined)
            return res.status(400).send({ status: false, message: "bookId is required." });

        let userId = req.params.userId;




        let data = req.body

        let files = req.files


        const upadatedData = {}

        let { address, fname, lname, phone, email, password, } = data // destructuring

        // if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        //if (!(address || fname || lname || phone || email || password || profileImage)) {
        // return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        // }

        // bookid Validation and reviwId validation
        let idCheck = mongoose.isValidObjectId(userId)

        if (!idCheck) return res.status(400).send({ status: false, msg: "user is not a type of objectId" })

        // user present or not
        let status = await userModel.findOne({ _id: userId },)
        if (!status) return res.status(404).send({ msg: "this user is not present" })



        if (status.isDeleted === true) return res.status(404).send({ status: false, msg: "this user is already deleted" })

        if (address.shipping.street) {
            if (address.billing.street.trim().toLowerCase().length === 0) return res.status(400).send({ status: false, msg: "in address street must be present and should be string and enter a valied street" })
            address.shipping.street = address.shipping.street.trim().toLowerCase()
        }
        if (address) {

            // if (address.shipping) return res.status(400).send({ status: false, msg: " shipping should be present" })
            if (Object.prototype.toString.call(address) === "[object Object]") {

                if (address.shipping) {

                    // console.log(add)

                    if (Object.prototype.toString.call(address.shipping) === "[object Object]") {


                        if (!address.shipping.street || typeof address.shipping.street !== "string" || !address.shipping.street.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address street must be present and should be string and enter a valied street" })
                        upadatedData[address.shipping.street] = address.shipping.street.trim().toLowerCase()
                        if (!address.shipping.city || typeof address.shipping.city !== "string" || !address.shipping.city.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address city must be present and should be string" })
                        upadatedData[address.shipping.city] = address.shipping.city.trim().toLowerCase()
                        if (!address.shipping.pincode || typeof address.shipping.pincode !== "string" || !address.shipping.pincode.trim()) return res.status(400).send({ status: false, msg: "in address pincode must be present present and should be string" })
                        let pin = /^[0-9]{6}$/.test(address.shipping.pincode.trim())
                        if (!pin) return res.status(400).send({ status: false, msg: " Address pincode Only have Number and 6 number only and should be string" })
                        upadatedData[address.shipping.pincode] = address.shipping.pincode.trim()
                    } else {
                        return res.status(400).send({ status: false, msg: "shipping should be in object form" })

                    }
                } else { return res.status(400).send({ status: false, msg: "shipping address Should be present" }) }

                // billing validation 
                if (address.billing) {

                    if (Object.prototype.toString.call(address.billing) === "[object Object]") {
                        if (!address.billing.street || typeof address.billing.street !== "string" || !address.billing.street.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in billing street must be present and should be string " })
                        address.billing.street = address.billing.street.trim().toLowerCase()
                        if (!address.billing.city || typeof address.billing.city !== "string" || !address.billing.city.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in billing city must be present and should be string" })
                        address.billing.city = address.billing.city.trim().toLowerCase()
                        if (!address.billing.pincode || typeof address.billing.pincode !== "string" || !address.billing.pincode.trim()) return res.status(400).send({ status: false, msg: "in billing pincode must be present present and should be string" })
                        let pinn = /^[0-9]{6}$/.test(address.billing.pincode.trim())
                        if (!pinn) return res.status(400).send({ status: false, msg: " billing pincode Only have Number and 6 number only and should be string" })
                        address.billing.pincode = address.billing.pincode.trim()
                    }
                    else {
                        return res.status(400).send({ status: false, msg: "billing should be in object form" })
                    }

                }

            }
            else {
                return res.status(400).send({ status: false, msg: "addresss should be in object form and present ad shipping and billing should be present in address" })
            }
        }
        if (fname) {

            if (typeof fname !== "string" || fname.trim().length === 0) return res.status(400).send({ status: false, msg: "fname should be string" });

            let nname = /^[a-zA-Z ]{2,30}$/.test(fname.trim())
            if (!nname) return res.status(400).send({ status: false, msg: "enter valid  fname" })

            data.fname = data.fname.trim()

        }
        if (lname) {


            if (typeof lname !== "string" || lname.trim().length === 0) return res.status(400).send({ status: false, msg: "lname should be string" });

            let nnname = /^[a-zA-Z ]{2,30}$/.test(fname.trim())
            if (!nnname) return res.status(400).send({ status: false, msg: "enter valid  lname" })

            data.lname = data.lname.trim()
        }

        if (phone) {

            if (typeof phone !== "string") {
                return res.status(400).send({ status: false, msg: " phone number is mandatory and should be in string datatype" });
            }
            let mob = /^[0-9]{10}$/
            if (!mob.test(phone.trim())) {
                return res.status(400).send({ status: false, msg: " phone number should have 10 digits only" });
            }
            let call = await userModel.findOne({ phone: phone.trim() })

            if (call) return res.status(400).send({ status: false, msg: "this phone is already present" })
            data.phone = data.phone.trim()
        }

        if (email) {
            if (typeof email != "string")
                return res.status(400).send({ status: false, message: "Email must be in String datatype" })
            let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

            let x = regx.test(email.trim())
            if (!x) {
                return res.status(400).send({ status: false, msg: "write the correct format for email" })
            }
            let mail = await userModel.findOne({ email: email.trim().toLowerCase() })

            if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
            data.email = data.email.trim().toLowerCase()
        }

        if (password) {

            if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

            let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*\.])(?=.*[A-Z]).{8,200}$/.test(password.trim())

            if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })

            const salt = await bcrypt.genSalt(10)

            let passs = await bcrypt.hash(data.password, salt)

            const updateuser = await userModel.findOneAndUpdate({ _id: userId?.trim() }, {

                $set: { password: passs }

            }, { new: true })



            // return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
        }
        //let files = req.files
        if (files) {





            // let files = req.files
            // console.log(files)
            if (files && files.length > 0) {
                //upload to s3 and get the uploaded link
                // res.send the link back to frontend/postman
                let uploadedFileURL = await uploadFile(files[0])
                data.profileImage = uploadedFileURL
                let Image = data.profileImage
                // return res.status(201).send({ status: true, data: user })

                const update = await userModel.findOneAndUpdate({ _id: userId?.trim() }, {

                    $set: { profileImage: Image }

                }, { new: true })
            }

        }

        //console.log(files)

        const updateuser = await userModel.findOneAndUpdate({ _id: userId?.trim() }, {

            $set: { fname: fname, lname: lname, address: address, email: email, phone: phone, upadatedData }

        }, { new: true })//.select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        const user = await userModel.findById(userId)



        return res.status(200).send({ status: true, msg: "updated User", data: user });
    } catch (err) {
        // console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}



const updateProduct = async function (req, res) {

    try {
        if (req.params.productId == undefined)
            return res.status(400).send({ status: false, message: "bookId is required." });

        let productId = req.params.productId;




        let data = req.body

        let files = req.files


        const upadatedData = {}

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, isDeleted } = data // destructuring

        // if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        //if (!(address || fname || lname || phone || email || password || profileImage)) {
        // return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        // }

        // bookid Validation and reviwId validation
        let idCheck = mongoose.isValidObjectId(productId)

        if (!idCheck) return res.status(400).send({ status: false, msg: "user is not a type of objectId" })

        // user present or not
        let status = await productModel.findOne({ _id: productId },)
        if (!status) return res.status(404).send({ msg: "this Product is not present" })

        let titlee = await productModel.findOne({ title: title },)

        console.log(titlee)

        if(titlee) return res.status(404).send({ msg: "this title is already present" })



        if (status.isDeleted === true) return res.status(404).send({ status: false, msg: "this product is already deleted" })

        
        if (title) {
        
        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid title" });
        title = title.trim()

        }
        if (description) {


            if (typeof description !== "string" || description.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid Description" });
        description = description.trim()
        }

        if (price) {

            if (!(!isNaN(Number(price)))) return res.status(400).send({ status: false, msg: "please enter valid Price and Should be in Number" });


            if (price < 0) {
                return res.status(400).send({ status: false, msg: "Price Shoud be In Valid  Number only" })
            }
        }

        if (currencyId) {
            if (typeof description !== "string" || description.trim().length === 0) return res.status(400).send({ status: false, msg: "currencyId Should be in String" });

        if (currencyId.toUpperCase() != "INR") return res.status(400).send({ status: false, msg: "currencyId Only INR accepted " });

        currencyId = currencyId.toUpperCase()
        }

        if (currencyFormat) {

            if (currencyFormat != "₹") {
                return res.status(400).send({ status: false, msg: "Only Indian Currency ₹ accepted" })
            }



            // return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
        }

        if (isFreeShipping) {

            let Shipping = JSON.parse(isFreeShipping)

            if (typeof Shipping !== 'boolean') {
                return res.status(400).send({ status: false, msg: "isFreeShipping should be in Boolen valus" })
            }

            const update = await productModel.findOneAndUpdate({ _id: productId?.trim() }, {

                $set: { isFreeShipping: Shipping }

            }, { new: true })
            data.isFreeShipping = Shipping


            // return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
        }

        if (style) {

           
            if (typeof style !== "string" || style.trim().length === 0) return res.status(400).send({ status: false, msg: "please enter valid style" });
            data.style = data.style.trim()


            // return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
        }

        if (installments) {

           
            if (!(!isNaN(Number(installments)))) return res.status(400).send({ status: false, msg: "please enter valid installments and Should be in Number" });

            if (installments < 0) {
                return res.status(400).send({ status: false, msg: "installments Shoud be In Valid  Number only" })
            }
            data.installments = data.installments

            // return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
        }

        if (isDeleted) {

            let Del = JSON.parse(isDeleted)
            console.log(typeof Del)

            if (typeof Del !== "boolean") {
                return res.status(400).send({ status: false, msg: "isDeleted is boolean so,it can be either true or false" })
            }
            if (Del === true) { data.deletedAt = Date.now() }
            const update = await productModel.findOneAndUpdate({ _id: productId?.trim() }, {

                $set: { isDeleted: Del }

            }, { new: true })
            data.isDeleted = Del

        }

        if (availableSizes) {

            let siz = availableSizes.split(",")

            // console.log(siz)
            if (!Array.isArray(siz)) return res.status(400).send({ status: false, msg: "availableSizes should be array of strings" })

            if (siz.some(sub => typeof sub === "string" && sub.trim().length === 0)) {
               // return res.status(400).send({ status: false, message: " availableSizes should not be empty or with white spaces" })
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

            const update = await productModel.findOneAndUpdate({ _id: productId?.trim() }, {

                $set: { availableSizes: subtrim }

            }, { new: true })
          //  data.availableSizes = subtrim

        }
        //let files = req.files
        if (files) {





            // let files = req.files
            // console.log(files)
            if (files && files.length > 0) {
                //upload to s3 and get the uploaded link
                // res.send the link back to frontend/postman
                let uploadedFileURL = await uploadFile(files[0])
                data.productImage = uploadedFileURL
                let Image = data.productImage
                // return res.status(201).send({ status: true, data: user })

                const update = await productModel.findOneAndUpdate({ _id: productId?.trim() }, {

                    $set: { productImage: Image }

                }, { new: true })
            }

        }

        //console.log(files)

        const updateuser = await productModel.findOneAndUpdate({ _id: productId?.trim() }, {

            $set: { title: title, description: description, price: price, currencyId : currencyId, currencyFormat: currencyFormat,  style:style, installments:installments }

        }, { new: true })//.select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        const product = await productModel.findById(productId)



        return res.status(200).send({ status: true, msg: "updated User", data: product });
    } catch (err) {
        // console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}


//module.exports.updatebooks = updatebooks
module.exports.updateuser = updateuser

module.exports.updateProduct = updateProduct