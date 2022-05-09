const userModel = require("../model/userModel")




const createuser = async(req, res) => {
    try {
        let data = req.body
            //  data validation

        let { phone, name, title, email, password, address } = data


        if (data === undefined || Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "plz enter some data" })

        // Fname validation
        console.log(typeof name)
        if (name === undefined) return res.status(400).send({ status: false, msg: "first name must be present" });
        // if(typeof fname !== "string"||fname.trim().length ===0) return res.status(400).send({ status:false, msg: "fname should be string" });
        // data.fname = data.fname.trim()
        let nname = /^[a-zA-z ]{2,30}$/.test(name)
        if (!nname) return res.status(400).send({ status: false, msg: "enter valid  name" })




        // title validation
        if (!title.trim()) return res.status(400).send({ status: false, msg: "title must be present" });
        if (typeof title !== "string") return res.status(400).send({ status: false, msg: "title should be string" });
        if (!(["Mr", "Mrs", "Miss"].includes(data.title.trim()))) return res.status(400).send({ status: false, msg: "plz write valid title" })

        // email validation
        if (!email) {
            return res.status(400).send({ status: false, msg: "email must be present" });
        }

        let regx = /^([a-zA-Z0-9\._]+)@([a-zA-Z])+\.([a-z]+)(.[a-z])?$/

        let x = regx.test(email)
        if (!x) {
            return res.status(400).send({ status: false, msg: "write the correct format for email" })
        }
        let mail = await userModel.findOne({ email: email.toLowerCase() })

        if (mail) return res.status(400).send({ status: false, msg: "this email is already present" })
            // data.email = data.email.toLowerCase()

        // password validation
        if (!password.trim()) return res.status(400).send({ status: false, msg: "plz write the password" });
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "enter valid password" });

        let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[A-Z]).{8,16}$/.test(password.trim())

        if (!pass) return res.status(400).send({ status: false, msg: "1.At least one digit, 2.At least one lowercase character,3.At least one uppercase character,4.At least one special character, 5. At least 8 characters in length, but no more than 16" })
        data.password = data.password.trim()
            // Phone va
        let mob = /^[0-9]{10}$/
        if (!mob.test(phone)) {
            return res.status(400).send({ status: false, msg: " phone number should have 10 digits only" });
        }

        if (Object.values(phone).length < 10 || Object.values(phone).length > 10) {
            return res.status(400).send({ status: false, msg: "Enter the vailid mobile number" });
        }
        let call = await userModel.findOne({ phone: phone })

        if (call) return res.status(400).send({ status: false, msg: "this phone is already present" })

        // address validation 
        if (!address.street.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address street must be present present" })
        if (!address.city.trim().toLowerCase()) return res.status(400).send({ status: false, msg: "in address city must be present" })
        if (!address.pincode.trim()) return res.status(400).send({ status: false, msg: "in address pincode must be present present" })
        let pin = /^[0-9]{6}$/.test(address.pincode)
        if (!pin) return res.status(400).send({ status: false, msg: " Address pincode Only have Number and 6 number only " })

        let user = await userModel.create(data)

        return res.status(201).send({ status: true, data: user })
    } catch (err) {
        res.status(500).send({ status: "error", msg: err.message })
    }
}




module.exports.createuser = createuser