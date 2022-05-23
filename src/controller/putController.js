const mongoose = require('mongoose');
const userModel = require("../model/userModel")
//const bookModel = require("../model/bookModel")
//const reviewModel = require("../model/reviewModel")





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

        let { address, fname, lname, phone, email, password, profileImage } = data // destructuring

        if (!data || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        if (!(address || fname || lname || phone || email || password || profileImage)) {
            return res.status(404).send({ status: false, msg: "Plz enter valid keys for updation " })
        }

        // bookid Validation and reviwId validation
        let idCheck = mongoose.isValidObjectId(userId)

        if (!idCheck) return res.status(400).send({ status: false, msg: "user is not a type of objectId" })

        // user present or not
        let status = await userModel.findOne({ _id: userId },)
        if (!status) return res.status(404).send({ msg: "this user is not present" })



        if (status.isDeleted === true) return res.status(404).send({ status: false, msg: "this book is already deleted" })


        if (address) {
            if (Object.prototype.toString.call(address) === "[object Object]") {

                if (!address.shipping) {

                    if (Object.prototype.toString.call(address.shipping) === "[object Object]") {

                        if (!address.shipping.street) {
                            if ( typeof address.shipping.street !== "string"|| address.billing.street.trim().toLowerCase().length===0 ) return res.status(400).send({ status: false, msg: "in address street must be present and should be string and enter a valied street" })
                            address.shipping.street = address.shipping.street.trim().toLowerCase()
                        }
                        if (!address.shipping.city) {
                            if ( typeof address.shipping.city !== "string" ) return res.status(400).send({ status: false, msg: "in address city must be present and should be string" })
                            address.shipping.city = address.shipping.city.trim().toLowerCase()
                        }
                        if (!address.shipping.pincode) {
                            if ( typeof address.shipping.pincode !== "string" ) return res.status(400).send({ status: false, msg: "in address pincode must be present present and should be string" })
                            let pin = /^[0-9]{6}$/.test(address.shipping.pincode.trim())
                            if (!pin) return res.status(400).send({ status: false, msg: " Address pincode Only have Number and 6 number only and should be string" })
                            address.shipping.pincode = address.shipping.pincode.trim()
                        }
                    } else {
                        return res.status(400).send({ status: false, msg: "shipping shipping should be in object form" })

                    }

                }
                // billing validation 
                if (!address.billing) {

                    if (Object.prototype.toString.call(address.billing) === "[object Object]") {
                        if (!address.billing.street) {
                            if ( typeof address.billing.street !== "string" || address.billing.street.trim().toLowerCase().length===0 ) return res.status(400).send({ status: false, msg: "in billing street must be present and should be string " })
                            address.billing.street = address.billing.street.trim().toLowerCase()
                        }
                        if (!address.billing.city) {
                            if ( typeof address.billing.city !== "string" ) return res.status(400).send({ status: false, msg: "in billing city must be present and should be string" })
                            address.billing.city = address.billing.city.trim().toLowerCase()
                        }
                        if (!address.billing.pincode) {
                            if ( typeof address.billing.pincode !== "string" ) return res.status(400).send({ status: false, msg: "in billing pincode must be present present and should be string" })
                            let pinn = /^[0-9]{6}$/.test(address.billing.pincode.trim())
                            if (!pinn) return res.status(400).send({ status: false, msg: " billing pincode Only have Number and 6 number only and should be string" })
                            address.billing.pincode = address.billing.pincode.trim()
                        }
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

            let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*\.])(?=.*[A-Z]).{8,15}$/.test(password.trim())

            if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })
            data.password = data.password.trim()
        }

        if (profileImage) {


            if (typeof profileImage !== "string" || profileImage.trim().length === 0) return res.status(400).send({ status: false, msg: "profileImage should be string" });

            if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:\+.~#?&//=]*)/.test(profileImage.trim()))) {
                return res.status(400).send({ status: false, msg: "logoLink is a not valid" });
            }

        }



        const updateuser = await userModel.findOneAndUpdate({ _id: userId?.trim() }, {

            $set: { fname: fname, lname: lname, address: address, password: password, profileImage: profileImage, email: email, phone: phone }

        }, { new: true })//.select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })



        return res.status(200).send({ status: true, msg: "updated User", data: updateuser });
    } catch (err) {
        // console.log(err.message)
        return res.status(500).send({ status: "error", error: err.message })
    }


}

//module.exports.updatebooks = updatebooks
module.exports.updateuser = updateuser